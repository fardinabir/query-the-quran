const express = require('express');
const router = express.Router();
const verseController = require('../../controllers/user/verseController');
const readVerseController = require('../../controllers/user/readVerseController');

// Search endpoints
router.get('/search', verseController.searchVerses);
router.get('/suggest', verseController.getSuggestions);

// Verse reading endpoint
router.get('/read', readVerseController.getConsecutiveVerses);

module.exports = router;