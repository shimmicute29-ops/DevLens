const express = require('express');
const db = require('../../config/database');

const router = express.Router();

// Get developer profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const profile = await db.query(
      'SELECT u.*, dp.* FROM users u LEFT JOIN developer_profiles dp ON u.id = dp.user_id WHERE u.id = $1',
      [userId]
    );
    if (profile.rows.length === 0) {
      return res.status(404).json({ error: 'Developer not found' });
    }

    res.json(profile.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get skills
router.get('/:userId/skills', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const skills = await db.query(
      'SELECT * FROM developer_skills WHERE user_id = $1 ORDER BY skill_category, proficiency DESC',
      [userId]
    );

    res.json(skills.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update skills
router.post('/:userId/skills', async (req, res) => {
  try {
    const { userId } = req.params;
    const { skills } = req.body;

    for (const skill of skills) {
      await db.query(
        'INSERT INTO developer_skills (user_id, skill_name, skill_category, proficiency, years_of_experience) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id, skill_name) DO UPDATE SET proficiency = $4, years_of_experience = $5',
        [userId, skill.name, skill.category, skill.proficiency, skill.yearsOfExperience]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recommendations
router.get('/:userId/recommendations', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const recommendations = await db.query(
      'SELECT * FROM skill_recommendations WHERE user_id = $1 ORDER BY confidence DESC LIMIT 10',
      [userId]
    );

    res.json(recommendations.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Compare developers
router.post('/:userId/compare', async (req, res) => {
  try {
    const { userId } = req.params;
    const { compareWithUserIds } = req.body;

    // Get skills for all users
    const skills1 = await db.query(
      'SELECT * FROM developer_skills WHERE user_id = $1',
      [userId]
    );

    const comparisons = [];
    for (const compareUserId of compareWithUserIds) {
      const skills2 = await db.query(
        'SELECT * FROM developer_skills WHERE user_id = $1',
        [compareUserId]
      );

      comparisons.push({
        userId: compareUserId,
        skills1: skills1.rows,
        skills2: skills2.rows
      });
    }

    res.json(comparisons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
