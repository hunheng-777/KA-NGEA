const ApplicationModel = require('../models/applicationModel');

const getApplicationsByListing = async (req, res) => {
    try {
        const applications = await ApplicationModel.getApplicationsByListing(req.params.listing_id);
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};

const getApplicationsByStudent = async (req, res) => {
    try {
        const applications = await ApplicationModel.getApplicationsByStudent(req.params.student_id);
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};

const createApplication = async (req, res) => {
    try {
        const student_id = req.user.id;
        const id = await ApplicationModel.createApplication({ student_id, ...req.body });
        res.status(201).json({ message: 'Application submitted', id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit application' });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        await ApplicationModel.updateApplicationStatus(req.params.id, status);
        res.json({ message: 'Application status updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update status' });
    }
};

const deleteApplication = async (req, res) => {
    try {
        await ApplicationModel.deleteApplication(req.params.id);
        res.json({ message: 'Application withdrawn' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to withdraw application' });
    }
};

module.exports = { getApplicationsByListing, getApplicationsByStudent, createApplication, updateApplicationStatus, deleteApplication };