import pool from '../config/db.js';

// Get all listings
export const getAllListings = async () => {
    const [rows] = await pool.query('SELECT * FROM listings ORDER BY created_at DESC');
    return rows;
};

// Get one listing by ID
export const getListingById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM listings WHERE id = ?', [id]);
    return rows[0];
};

// Create a new listing
export const createListing = async (data) => {
    const { employer_id, title, company_name, type, location, salary, description, requirements, deadline } = data;
    const [result] = await pool.query(
        'INSERT INTO listings (employer_id, title, company_name, type, location, salary, description, requirements, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [employer_id, title, company_name, type, location, salary, description, requirements, deadline]
    );
    return result.insertId;
};

// Update a listing
export const updateListing = async (id, data) => {
    const { title, company_name, type, location, salary, description, requirements, deadline } = data;
    await pool.query(
        'UPDATE listings SET title=?, company_name=?, type=?, location=?, salary=?, description=?, requirements=?, deadline=? WHERE id=?',
        [title, company_name, type, location, salary, description, requirements, deadline, id]
    );
};

// Delete a listing
export const deleteListing = async (id) => {
    await pool.query('DELETE FROM listings WHERE id = ?', [id]);
};