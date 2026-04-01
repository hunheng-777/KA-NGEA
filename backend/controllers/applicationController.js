import * as ApplicationModel from '../models/applicationModel.js';

// For employers - see who applied to their listing
export const getApplicationsByListing = async (req, res) => {
    try {
        const applications = await ApplicationModel.getApplicationsByListing(req.params.listing_id);
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};

// For students - see all their own applications
export const getApplicationsByStudent = async (req, res) => {
    try {
        const applications = await ApplicationModel.getApplicationsByStudent(req.params.student_id);
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};

// For students - apply to a listing
export const createApplication = async (req, res) => {
    try {
        const student_id = req.user.id;
        const id = await ApplicationModel.createApplication({ student_id, ...req.body });
        res.status(201).json({ message: 'Application submitted', id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit application' });
    }
};

// For employers - update application status
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        await ApplicationModel.updateApplicationStatus(req.params.id, status);
        res.json({ message: 'Application status updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update status' });
    }
};

// For students - withdraw an application
export const deleteApplication = async (req, res) => {
    try {
        await ApplicationModel.deleteApplication(req.params.id);
        res.json({ message: 'Application withdrawn' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to withdraw application' });
    }
};