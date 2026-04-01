const express = require('express');
const ApplicationController = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const router = express.Router();

// Employer - see who applied to their listing
router.get('/listing/:listing_id', protect, restrictTo('employer'), ApplicationController.getApplicationsByListing);

// Student - see their own applications
router.get('/student/:student_id', protect, restrictTo('student'), ApplicationController.getApplicationsByStudent);

// Student - apply to a listing
router.post('/', protect, restrictTo('student'), ApplicationController.createApplication);

// Employer - update application status
router.put('/:id', protect, restrictTo('employer'), ApplicationController.updateApplicationStatus);

// Student - withdraw an application
router.delete('/:id', protect, restrictTo('student'), ApplicationController.deleteApplication);

module.exports = router;


