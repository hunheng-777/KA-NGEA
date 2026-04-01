import pool from '../config/db.js';

// Get all bookmarks by a specific student
export const getBookmarksByStudent = async (student_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM bookmarks WHERE student_id = ?', [student_id]
    );
    return rows;
};

// Add a bookmark
export const createBookmark = async (student_id, listing_id) => {
    const [result] = await pool.query(
        'INSERT INTO bookmarks (student_id, listing_id) VALUES (?, ?)',
        [student_id, listing_id]
    );
    return result.insertId;
};

// Remove a bookmark
export const deleteBookmark = async (student_id, listing_id) => {
    await pool.query(
        'DELETE FROM bookmarks WHERE student_id = ? AND listing_id = ?',
        [student_id, listing_id]
    );
};

// Check if a listing is already bookmarked
export const checkBookmark = async (student_id, listing_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM bookmarks WHERE student_id = ? AND listing_id = ?',
        [student_id, listing_id]
    );
    return rows[0];
};