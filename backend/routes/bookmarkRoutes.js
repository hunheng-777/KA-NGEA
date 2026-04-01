const express = require('express');
const BookmarkController = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const router = express.Router();

// Student - get all their bookmarks
router.get('/:student_id', protect, restrictTo('student'), BookmarkController.getBookmarksByStudent);

// Student - add a bookmark
router.post('/', protect, restrictTo('student'), BookmarkController.createBookmark);

// Student - remove a bookmark
router.delete('/', protect, restrictTo('student'), BookmarkController.deleteBookmark);

module.exports = router;