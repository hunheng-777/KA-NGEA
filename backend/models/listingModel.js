const pool = require('../config/db');

const getAllListings = async () => {
    const [rows] = await pool.query('SELECT * FROM listings ORDER BY created_at DESC');
    return rows;
};

const getListingById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM listings WHERE id = ?', [id]);
    return rows[0];
};

const createListing = async (data) => {
    const { employer_id, title, company, type, location, description, requirements, deadline } = data;
    const [result] = await pool.query(
        'INSERT INTO listings (employer_id, title, company, type, location, description, requirements, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [employer_id, title, company, type, location, description, requirements, deadline]
    );
    return result.insertId;
};

const updateListing = async (id, data) => {
    const { title, company, type, location, description, requirements, deadline, is_active } = data;
    await pool.query(
        'UPDATE listings SET title=?, company=?, type=?, location=?, description=?, requirements=?, deadline=?, is_active=? WHERE id=?',
        [title, company, type, location, description, requirements, deadline, is_active, id]
    );
};

const deleteListing = async (id) => {
    await pool.query('DELETE FROM listings WHERE id = ?', [id]);
};

module.exports = { getAllListings, getListingById, createListing, updateListing, deleteListing };