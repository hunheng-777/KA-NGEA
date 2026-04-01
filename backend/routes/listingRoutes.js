import express from 'express';
import * as ListingController from '../controllers/listingController.js';

const router = express.Router();

// Public routes - anyone can access
router.get('/', ListingController.getAllListings);
router.get('/:id', ListingController.getListingById);

// Employer only routes
router.post('/', ListingController.createListing);
router.put('/:id', ListingController.updateListing);
router.delete('/:id', ListingController.deleteListing);

export default router;