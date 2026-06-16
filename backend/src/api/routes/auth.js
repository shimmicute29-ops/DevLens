const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult, body } = require('express-validator');
const db = require('../../config/database');
const { generateToken } = require('../../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Register
router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('name').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, name } = req.body;
      
      // Check if user exists
      const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (user.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      // Create user
      await db.query(
        'INSERT INTO users (id, email, password, name, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [userId, email, hashedPassword, name]
      );

      // Create profile
      await db.query(
        'INSERT INTO developer_profiles (user_id, created_at) VALUES ($1, NOW())',
        [userId]
      );

      const token = generateToken(userId, email);
      res.json({ token, userId, email, name });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Login
router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      
      // Find user
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user.id, user.email);
      res.json({ token, userId: user.id, email: user.email, name: user.name });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
