const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const db = require('../config/db')

// Get profile
router.get('/profile', protect, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, full_name, email, role, avatar_url, bio, phone, university, location, linkedin_url, github_url, graduation_year FROM users WHERE id = ?',
      [req.user.id]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { full_name, bio, phone, university, location, linkedin_url, github_url, graduation_year } = req.body
    await db.query(
      `UPDATE users SET full_name=?, bio=?, phone=?, university=?, location=?, linkedin_url=?, github_url=?, graduation_year=? WHERE id=?`,
      [full_name, bio, phone, university, location, linkedin_url, github_url, graduation_year, req.user.id]
    )
    res.json({ message: 'Profile updated successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router