const express = require('express');
const ListingController = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.get('/', ListingController.getAllListings);
router.get('/:id', ListingController.getListingById);

// Employer only routes
router.post('/', protect, restrictTo('employer'), ListingController.createListing);
router.put('/:id', protect, restrictTo('employer'), ListingController.updateListing);
router.delete('/:id', protect, restrictTo('employer', 'admin'), ListingController.deleteListing);

module.exports = router;