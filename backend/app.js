const express = require('express')
const cors = require('cors')
require('dotenv').config()
const db = require('./config/db')

const app = express()

app.use(cors())
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'KaNgea API is running!' })
})

// Routes
app.use('/api/auth', require('./routes/userRoutes'))

// Test DB connection
db.query('SELECT 1').then(() => {
  console.log('Database connected successfully!')
}).catch((err) => {
  console.error('Database connection failed:', err.message)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})