const express = require('express')
const { getStats, getAllUsers, deleteUser, getAllListings, deleteListing } = require('../controllers/adminController.js')
const { protect } = require('../middleware/authMiddleware.js')
const { restrictTo } = require('../middleware/roleMiddleware.js')

const router = express.Router()

router.use(protect)
router.use(restrictTo('admin'))

router.get('/stats',           getStats)
router.get('/users',           getAllUsers)
router.delete('/users/:id',    deleteUser)
router.get('/listings',        getAllListings)
router.delete('/listings/:id', deleteListing)

module.exports = router