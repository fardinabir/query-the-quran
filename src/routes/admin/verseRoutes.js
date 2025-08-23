const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload');
const verseController = require('../../controllers/admin/verseController');

// Admin endpoints
router.post('/upload', upload.single('file'), verseController.uploadAndIndexCSV);
router.get('/health', verseController.getClusterHealth);

module.exports = router;