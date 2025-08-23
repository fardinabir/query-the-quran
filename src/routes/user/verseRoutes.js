const express = require('express');
const router = express.Router();
const verseController = require('../../controllers/user/verseController');

// Search endpoints
router.get('/search', verseController.searchVerses);
router.get('/suggest', verseController.getSuggestions);

module.exports = router;