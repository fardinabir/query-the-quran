const express = require('express');
const router = express.Router();
const verseController = require('../../controllers/user/verseController');
const readVerseController = require('../../controllers/user/readVerseController');

// Search endpoint
router.get('/search', verseController.searchVerses);

// Verse reading endpoint
router.get('/read', readVerseController.getConsecutiveVerses);

module.exports = router;