const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
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

// Update password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Get current user
    const [rows] = await db.query(
      'SELECT * FROM users WHERE id = ?', [req.user.id]
    )
    const user = rows[0]

    // Check current password
    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    )

    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router