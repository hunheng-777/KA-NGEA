const pool = require('../config/db');

const getBookmarksByStudent = async (student_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM bookmarks WHERE student_id = ?', [student_id]
    );
    return rows;
};

const createBookmark = async (student_id, listing_id) => {
    const [result] = await pool.query(
        'INSERT INTO bookmarks (student_id, listing_id) VALUES (?, ?)',
        [student_id, listing_id]
    );
    return result.insertId;
};

const deleteBookmark = async (student_id, listing_id) => {
    await pool.query(
        'DELETE FROM bookmarks WHERE student_id = ? AND listing_id = ?',
        [student_id, listing_id]
    );
};

const checkBookmark = async (student_id, listing_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM bookmarks WHERE student_id = ? AND listing_id = ?',
        [student_id, listing_id]
    );
    return rows[0];
};

module.exports = { getBookmarksByStudent, createBookmark, deleteBookmark, checkBookmark };