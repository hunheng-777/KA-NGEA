import express from 'express';
import * as BookmarkController from '../controllers/bookmarkController.js';

const router = express.Router();

// Get all bookmarks for a student
router.get('/:student_id', BookmarkController.getBookmarksByStudent);

// Add a bookmark
router.post('/', BookmarkController.createBookmark);

// Remove a bookmark
router.delete('/', BookmarkController.deleteBookmark);

export default router;