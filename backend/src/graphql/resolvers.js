const db = require('../../config/database');
const redis = require('../../config/redis');
const { v4: uuidv4 } = require('uuid');

const resolvers = {
  Query: {
    developer: async (_, { id }) => {
      const result = await db.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    },

    developers: async (_, { limit = 10, offset = 0 }) => {
      const result = await db.query(
        'SELECT * FROM users LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      return result.rows;
    },

    assessments: async (_, { category, difficulty }) => {
      let query = 'SELECT * FROM assessments WHERE is_active = true';
      let params = [];

      if (category) {
        params.push(category);
        query += ` AND category = $${params.length}`;
      }
      if (difficulty) {
        params.push(difficulty);
        query += ` AND difficulty = $${params.length}`;
      }

      const result = await db.query(query, params);
      return result.rows;
    },

    assessment: async (_, { id }) => {
      const result = await db.query(
        'SELECT * FROM assessments WHERE id = $1',
        [id]
      );
      return result.rows[0];
    },

    mySkills: async (_, __, { req }) => {
      if (!req.user) throw new Error('Unauthorized');
      const result = await db.query(
        'SELECT * FROM developer_skills WHERE user_id = $1 ORDER BY skill_category',
        [req.user.userId]
      );
      return result.rows;
    },

    recommendations: async (_, { limit = 5 }, { req }) => {
      if (!req.user) throw new Error('Unauthorized');
      const result = await db.query(
        'SELECT * FROM skill_recommendations WHERE user_id = $1 ORDER BY confidence DESC LIMIT $2',
        [req.user.userId, limit]
      );
      return result.rows;
    },

    teams: async (_, __, { req }) => {
      if (!req.user) throw new Error('Unauthorized');
      const result = await db.query(
        `SELECT t.* FROM teams t
         JOIN team_members tm ON t.id = tm.team_id
         WHERE tm.user_id = $1`,
        [req.user.userId]
      );
      return result.rows;
    },

    team: async (_, { id }) => {
      const result = await db.query(
        'SELECT * FROM teams WHERE id = $1',
        [id]
      );
      return result.rows[0];
    },

    reports: async (_, { limit = 10 }, { req }) => {
      if (!req.user) throw new Error('Unauthorized');
      const result = await db.query(
        'SELECT * FROM reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
        [req.user.userId, limit]
      );
      return result.rows;
    }
  },

  Mutation: {
    updateProfile: async (_, { input }, { req }) => {
      if (!req.user) throw new Error('Unauthorized');
      
      await db.query(
        `UPDATE developer_profiles SET 
         bio = $1, current_role = $2, company = $3, location = $4, 
         github_url = $5, linkedin_url = $6, portfolio_url = $7, updated_at = NOW()
         WHERE user_id = $8`,
        [input.bio, input.currentRole, input.company, input.location,
         input.github, input.linkedin, input.portfolio, req.user.userId]
      );

      const result = await db.query(
        'SELECT * FROM users WHERE id = $1',
        [req.user.userId]
      );
      return result.rows[0];
    },

    addSkills: async (_, { skills }, { req }) => {
      if (!req.user) throw new Error('Unauthorized');

      const results = [];
      for (const skill of skills) {
        await db.query(
          `INSERT INTO developer_skills (user_id, skill_name, skill_category, proficiency, years_of_experience)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (user_id, skill_name) DO UPDATE SET proficiency = $4, years_of_experience = $5`,
          [req.user.userId, skill.name, skill.category, skill.proficiency, skill.yearsOfExperience]
        );
        results.push(skill);
      }
      return results;
    },

    startAssessment: async (_, { assessmentId }, { req }) => {
      if (!req.user) throw new Error('Unauthorized');

      const sessionId = uuidv4();
      await db.query(
        'INSERT INTO assessment_sessions (id, user_id, assessment_id, started_at) VALUES ($1, $2, $3, NOW())',
        [sessionId, req.user.userId, assessmentId]
      );

      const result = await db.query(
        'SELECT * FROM assessment_sessions WHERE id = $1',
        [sessionId]
      );
      return result.rows[0];
    },

    submitAssessment: async (_, { sessionId, answers }, { req }) => {
      if (!req.user) throw new Error('Unauthorized');

      let score = 0;
      let totalPoints = 0;
      const feedback = {};

      for (const answer of answers) {
        const question = await db.query(
          'SELECT * FROM assessment_questions WHERE id = $1',
          [answer.questionId]
        );
        const q = question.rows[0];
        totalPoints += q.points || 10;
        
        if (answer.selected === q.correct_answer) {
          score += q.points || 10;
          feedback[answer.questionId] = { correct: true };
        } else {
          feedback[answer.questionId] = { correct: false, correctAnswer: q.correct_answer };
        }
      }

      const percentage = (score / totalPoints) * 100;

      await db.query(
        'UPDATE assessment_sessions SET completed_at = NOW(), score = $1, percentage = $2, feedback = $3 WHERE id = $4',
        [score, percentage, JSON.stringify(feedback), sessionId]
      );

      return { sessionId, score, percentage, feedback };
    },

    createTeam: async (_, { name, description }, { req }) => {
      if (!req.user) throw new Error('Unauthorized');

      const teamId = uuidv4();
      await db.query(
        'INSERT INTO teams (id, name, description, created_by, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [teamId, name, description, req.user.userId]
      );

      // Add creator as member
      await db.query(
        'INSERT INTO team_members (team_id, user_id, role, joined_at) VALUES ($1, $2, $3, NOW())',
        [teamId, req.user.userId, 'owner']
      );

      return { id: teamId, name, description };
    },

    addTeamMember: async (_, { teamId, userId, role }, { req }) => {
      if (!req.user) throw new Error('Unauthorized');

      await db.query(
        'INSERT INTO team_members (team_id, user_id, role, joined_at) VALUES ($1, $2, $3, NOW())',
        [teamId, userId, role]
      );

      return { teamId, userId, role };
    },

    generateReport: async (_, { type }, { req }) => {
      if (!req.user) throw new Error('Unauthorized');

      const reportId = uuidv4();
      const data = await db.query(
        `SELECT u.*, 
                json_agg(json_build_object('skill', ds.skill_name, 'proficiency', ds.proficiency)) as skills
         FROM users u
         LEFT JOIN developer_skills ds ON u.id = ds.user_id
         WHERE u.id = $1
         GROUP BY u.id`,
        [req.user.userId]
      );

      await db.query(
        'INSERT INTO reports (id, user_id, report_type, data, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [reportId, req.user.userId, type, JSON.stringify(data.rows[0])]
      );

      return { id: reportId, type, data: JSON.stringify(data.rows[0]) };
    }
  }
};

module.exports = resolvers;
