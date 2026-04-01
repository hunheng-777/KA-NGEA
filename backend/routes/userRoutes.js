const express = require('express')
const router = express.Router()
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const { restrictTo } = require('../middleware/roleMiddleware')

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Protected routes
router.get('/me', protect, getMe)

// Role test routes
router.get('/student', protect, restrictTo('student'), (req, res) => {
  res.json({ message: 'Welcome Student!' })
})
router.get('/employer', protect, restrictTo('employer'), (req, res) => {
  res.json({ message: 'Welcome Employer!' })
})
router.get('/admin', protect, restrictTo('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' })
})

module.exports = router