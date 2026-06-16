const express = require('express');
const db = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Generate report
router.post('/', async (req, res) => {
  try {
    const { userId, reportType } = req.body;
    const reportId = uuidv4();

    // Gather data
    const profile = await db.query(
      'SELECT * FROM developer_profiles WHERE user_id = $1',
      [userId]
    );

    const skills = await db.query(
      'SELECT * FROM developer_skills WHERE user_id = $1',
      [userId]
    );

    const assessments = await db.query(
      'SELECT * FROM assessment_sessions WHERE user_id = $1 ORDER BY completed_at DESC LIMIT 10',
      [userId]
    );

    // Create report
    await db.query(
      'INSERT INTO reports (id, user_id, report_type, data, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [reportId, userId, reportType, JSON.stringify({ profile: profile.rows[0], skills: skills.rows, assessments: assessments.rows })]
    );

    res.json({ reportId, status: 'generated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get report
router.get('/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    
    const report = await db.query(
      'SELECT * FROM reports WHERE id = $1',
      [reportId]
    );
    if (report.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
