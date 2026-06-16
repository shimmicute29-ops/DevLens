const express = require('express');
const db = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get teams
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const teams = await db.query(
      'SELECT * FROM teams WHERE id IN (SELECT team_id FROM team_members WHERE user_id = $1)',
      [userId]
    );
    res.json(teams.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get team analytics
router.get('/:teamId/analytics', async (req, res) => {
  try {
    const { teamId } = req.params;
    
    const members = await db.query(
      'SELECT user_id FROM team_members WHERE team_id = $1',
      [teamId]
    );

    const memberIds = members.rows.map(m => m.user_id);
    
    const skills = await db.query(
      `SELECT skill_category, AVG(proficiency) as avg_proficiency, COUNT(*) as count 
       FROM developer_skills 
       WHERE user_id = ANY($1) 
       GROUP BY skill_category`,
      [memberIds]
    );

    res.json({ teamSize: memberIds.length, skillDistribution: skills.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
