const express = require('express');
const db = require('../../config/database');
const redis = require('../../config/redis');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get available assessments
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM assessments WHERE is_active = true ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start assessment
router.post('/start', async (req, res) => {
  try {
    const { assessmentId } = req.body;
    const userId = req.user.userId;
    const sessionId = uuidv4();

    // Verify assessment exists
    const assessment = await db.query(
      'SELECT * FROM assessments WHERE id = $1',
      [assessmentId]
    );
    if (assessment.rows.length === 0) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // Create assessment session
    await db.query(
      'INSERT INTO assessment_sessions (id, user_id, assessment_id, started_at) VALUES ($1, $2, $3, NOW())',
      [sessionId, userId, assessmentId]
    );

    // Get assessment questions
    const questions = await db.query(
      'SELECT id, question, options, category FROM assessment_questions WHERE assessment_id = $1 ORDER BY RANDOM()',
      [assessmentId]
    );

    res.json({ sessionId, questions: questions.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit assessment
router.post('/submit', async (req, res) => {
  try {
    const { sessionId, answers } = req.body;
    const userId = req.user.userId;

    // Get session
    const session = await db.query(
      'SELECT * FROM assessment_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, userId]
    );
    if (session.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Grade answers
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
        feedback[answer.questionId] = { 
          correct: false, 
          correctAnswer: q.correct_answer 
        };
      }
    }

    const percentage = (score / totalPoints) * 100;

    // Update session
    await db.query(
      'UPDATE assessment_sessions SET completed_at = NOW(), score = $1, percentage = $2, feedback = $3 WHERE id = $4',
      [score, percentage, JSON.stringify(feedback), sessionId]
    );

    res.json({ score, totalPoints, percentage, feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get results
router.get('/:sessionId/results', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    const result = await db.query(
      'SELECT * FROM assessment_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
