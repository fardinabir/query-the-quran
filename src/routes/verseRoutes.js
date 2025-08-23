const express = require('express');
const router = express.Router();
const multer = require('multer');
const verseController = require('../controllers/verseController');

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Search endpoints
router.get('/search', verseController.searchVerses);
router.get('/suggest', verseController.getSuggestions);

// Admin endpoints
router.post('/admin/upload', upload.single('file'), verseController.uploadAndIndexCSV);
router.get('/admin/health', verseController.getClusterHealth);

module.exports = router;