require('dotenv').config()
const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/usersRoutes')
const authRoutes = require('./routes/authRoutes')
const listingRoutes = require('./routes/listingRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const bookmarkRoutes = require('./routes/bookmarkRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/api/auth',         authRoutes)
app.use('/api/users',        userRoutes)
app.use('/api/listings',     listingRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/bookmarks',    bookmarkRoutes)
app.use('/api/admin',        adminRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))