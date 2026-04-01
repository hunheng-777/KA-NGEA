import pool from '../config/db.js';

// Get all applications for a specific listing
export const getApplicationsByListing = async (listing_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM applications WHERE listing_id = ?', [listing_id]
    );
    return rows;
};

// Get all applications by a specific student
export const getApplicationsByStudent = async (student_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM applications WHERE student_id = ?', [student_id]
    );
    return rows;
};

// Create a new application
export const createApplication = async (data) => {
    const { student_id, listing_id, cover_letter } = data;
    const [result] = await pool.query(
        'INSERT INTO applications (student_id, listing_id, cover_letter) VALUES (?, ?, ?)',
        [student_id, listing_id, cover_letter]
    );
    return result.insertId;
};

// Update application status
export const updateApplicationStatus = async (id, status) => {
    await pool.query(
        'UPDATE applications SET status = ? WHERE id = ?', [status, id]
    );
};

// Withdraw an application
export const deleteApplication = async (id) => {
    await pool.query('DELETE FROM applications WHERE id = ?', [id]);
};