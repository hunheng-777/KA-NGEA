import * as ListingModel from '../models/listingModel.js';

export const getAllListings = async (req, res) => {
    try {
        const listings = await ListingModel.getAllListings();
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
};

export const getListingById = async (req, res) => {
    try {
        const listing = await ListingModel.getListingById(req.params.id);
        if (!listing) return res.status(404).json({ error: 'Listing not found' });
        res.json(listing);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch listing' });
    }
};

export const createListing = async (req, res) => {
    try {
        const employer_id = req.user.id;
        const id = await ListingModel.createListing({ employer_id, ...req.body });
        res.status(201).json({ message: 'Listing created', id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create listing' });
    }
};

export const updateListing = async (req, res) => {
    try {
        await ListingModel.updateListing(req.params.id, req.body);
        res.json({ message: 'Listing updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update listing' });
    }
};

export const deleteListing = async (req, res) => {
    try {
        await ListingModel.deleteListing(req.params.id);
        res.json({ message: 'Listing deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete listing' });
    }
};