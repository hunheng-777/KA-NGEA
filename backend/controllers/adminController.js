const pool = require('../config/db.js')

const getStats = async (req, res) => {
  try {
    const [[{ totalUsers }]]           = await pool.query('SELECT COUNT(*) AS totalUsers FROM users')
    const [[{ totalListings }]]        = await pool.query('SELECT COUNT(*) AS totalListings FROM listings')
    const [[{ totalApplications }]]    = await pool.query('SELECT COUNT(*) AS totalApplications FROM applications')
    const [[{ newUsersThisWeek }]]     = await pool.query(`SELECT COUNT(*) AS newUsersThisWeek FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`)
    const [[{ totalStudents }]]        = await pool.query(`SELECT COUNT(*) AS totalStudents FROM users WHERE role = 'student'`)
    const [[{ totalEmployers }]]       = await pool.query(`SELECT COUNT(*) AS totalEmployers FROM users WHERE role = 'employer'`)
    const [[{ totalAdmins }]]          = await pool.query(`SELECT COUNT(*) AS totalAdmins FROM users WHERE role = 'admin'`)
    const [[{ newStudentsThisWeek }]]  = await pool.query(`SELECT COUNT(*) AS newStudentsThisWeek FROM users WHERE role = 'student' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`)
    const [[{ newEmployersThisWeek }]] = await pool.query(`SELECT COUNT(*) AS newEmployersThisWeek FROM users WHERE role = 'employer' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`)

    const [recentUsers]    = await pool.query(`SELECT full_name, created_at FROM users ORDER BY created_at DESC LIMIT 5`)
    const [recentListings] = await pool.query(`SELECT title, created_at FROM listings ORDER BY created_at DESC LIMIT 5`)

    const activity = [
      ...recentUsers.map(u => ({
        type: 'register',
        message: `${u.full_name} registered`,
        time: new Date(u.created_at).toLocaleString()
      })),
      ...recentListings.map(l => ({
        type: 'job',
        message: `New listing posted: ${l.title}`,
        time: new Date(l.created_at).toLocaleString()
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10)

    res.json({
      stats: {
        totalUsers, totalListings, totalApplications,
        newUsersThisWeek, totalStudents, totalEmployers,
        totalAdmins, newStudentsThisWeek, newEmployersThisWeek
      },
      activity
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC'
    )
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteUser = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id])
    res.json({ message: 'User deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const getAllListings = async (req, res) => {
  try {
    const [listings] = await pool.query(
      'SELECT id, title, company, type, deadline, created_at FROM listings ORDER BY created_at DESC'
    )
    res.json(listings)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteListing = async (req, res) => {
  try {
    await pool.query('DELETE FROM listings WHERE id = ?', [req.params.id])
    res.json({ message: 'Listing deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getStats, getAllUsers, deleteUser, getAllListings, deleteListing }