import * as BookmarkModel from '../models/bookmarkModel.js';

// Get all bookmarks for a student
export const getBookmarksByStudent = async (req, res) => {
    try {
        const bookmarks = await BookmarkModel.getBookmarksByStudent(req.params.student_id);
        res.json(bookmarks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
};

// Add a bookmark
export const createBookmark = async (req, res) => {
    try {
        const student_id = req.user.id;
        const { listing_id } = req.body;

        const existing = await BookmarkModel.checkBookmark(student_id, listing_id);
        if (existing) return res.status(400).json({ error: 'Already bookmarked' });

        const id = await BookmarkModel.createBookmark(student_id, listing_id);
        res.status(201).json({ message: 'Bookmark added', id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add bookmark' });
    }
};

// Remove a bookmark
export const deleteBookmark = async (req, res) => {
    try {
        const student_id = req.user.id;
        const { listing_id } = req.body;
        await BookmarkModel.deleteBookmark(student_id, listing_id);
        res.json({ message: 'Bookmark removed' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove bookmark' });
    }
};