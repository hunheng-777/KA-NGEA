const express = require('express')
const { getStats, getAllUsers, deleteUser, getAllListings, deleteListing } = require('../controllers/admin.controller.js')
const { verifyToken } = require('../middleware/auth.middleware.js')
const { restrictTo } = require('../middleware/role.middleware.js')

const router = express.Router()

router.use(verifyToken)
router.use(requireRole('admin'))

router.get('/stats',           getStats)
router.get('/users',           getAllUsers)
router.delete('/users/:id',    deleteUser)
router.get('/listings',        getAllListings)
router.delete('/listings/:id', deleteListing)

module.exports = router