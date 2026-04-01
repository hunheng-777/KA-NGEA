const pool = require('../config/db');

const getApplicationsByListing = async (listing_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM applications WHERE listing_id = ?', [listing_id]
    );
    return rows;
};

const getApplicationsByStudent = async (student_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM applications WHERE student_id = ?', [student_id]
    );
    return rows;
};

const createApplication = async (data) => {
    const { student_id, listing_id, cover_letter } = data;
    const [result] = await pool.query(
        'INSERT INTO applications (student_id, listing_id, cover_letter) VALUES (?, ?, ?)',
        [student_id, listing_id, cover_letter]
    );
    return result.insertId;
};

const updateApplicationStatus = async (id, status) => {
    await pool.query(
        'UPDATE applications SET status = ? WHERE id = ?', [status, id]
    );
};

const deleteApplication = async (id) => {
    await pool.query('DELETE FROM applications WHERE id = ?', [id]);
};

module.exports = { getApplicationsByListing, getApplicationsByStudent, createApplication, updateApplicationStatus, deleteApplication };