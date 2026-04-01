const express = require('express')
const cors = require('cors')
require('dotenv').config()
const db = require('./config/db')

const app = express()

app.use(cors())
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'KA-NGEA API is running!' })
})

// Routes
app.use('/api/auth', require('./routes/userRoutes'))
app.use('/api/users', require('./routes/usersRoutes'))
app.use('/api/listings', require('./routes/listingRoutes'))
app.use('/api/applications', require('./routes/applicationRoutes'))
app.use('/api/bookmarks', require('./routes/bookmarkRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))

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