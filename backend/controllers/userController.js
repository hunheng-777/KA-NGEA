const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/userModel')

// REGISTER
exports.register = async (req, res) => {
  try {
    const { full_name, fullName, email, password, role } = req.body
    const name = full_name || fullName

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all fields' })
    }

    const allowedRoles = ['student', 'employer']
    const userRole = allowedRoles.includes(role) ? role : 'student'

    const existing = await User.findByEmail(email)
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create(name, email, hashedPassword, userRole)

    res.status(201).json({ message: 'Registered successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Please fill in all fields' })
    }

    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { password, ...safeUser } = user
    res.json(safeUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Please provide your email' })
    }

    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(404).json({ error: 'No account found with that email' })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000)

    await User.saveResetToken(user.id, resetToken, expires)

    res.json({
      message: 'Reset token generated',
      resetToken
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body

    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Please provide token and new password' })
    }

    const user = await User.findByResetToken(resetToken)
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await User.updatePassword(user.id, hashedPassword)

    res.json({ message: 'Password reset successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}