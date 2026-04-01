import express from 'express';
import * as ApplicationController from '../controllers/applicationController.js';

const router = express.Router();

// Get all applications for a specific listing (employer)
router.get('/listing/:listing_id', ApplicationController.getApplicationsByListing);

// Get all applications by a specific student
router.get('/student/:student_id', ApplicationController.getApplicationsByStudent);

// Submit an application (student)
router.post('/', ApplicationController.createApplication);

// Update application status (employer)
router.put('/:id', ApplicationController.updateApplicationStatus);

// Withdraw an application (student)
router.delete('/:id', ApplicationController.deleteApplication);

export default router;