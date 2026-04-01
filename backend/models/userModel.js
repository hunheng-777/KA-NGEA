const db = require('../config/db')

const User = {
  // Find user by email
  findByEmail: async (email) => {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?', [email]
    )
    return rows[0]
  },

  // Create new user
  create: async (full_name, email, hashedPassword, role) => {
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [full_name, email, hashedPassword, role || 'student']
    )
    return result
  },

  // Find user by ID
  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT id, full_name, email, role, avatar_url, bio FROM users WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  // Update user profile
  updateById: async (id, full_name, bio) => {
    const [result] = await db.query(
      'UPDATE users SET full_name = ?, bio = ? WHERE id = ?',
      [full_name, bio, id]
    )
    return result
  },

  // Get all users (admin only)
  findAll: async () => {
    const [rows] = await db.query(
      'SELECT id, full_name, email, role, created_at FROM users'
    )
    return rows
  },

  // Delete user (admin only)
  deleteById: async (id) => {
    const [result] = await db.query(
      'DELETE FROM users WHERE id = ?', [id]
    )
    return result
  }
}

module.exports = User