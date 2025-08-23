const express = require('express');
const cors = require('cors');
const path = require('path');
const basicAuth = require('express-basic-auth');
const multer = require('multer');
const { initializeIndex } = require('./utils/elasticsearch/config');
const verseRoutes = require('./routes/verseRoutes');

const app = express();

// Enable CORS
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv') {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'));
        }
    }
});

// Serve static files
app.use(express.static('public/user'));
app.use('/admin', express.static('public/admin'));

// Basic auth middleware for admin routes
const adminAuth = basicAuth({
    users: { 'admin': 'admin123' },
    challenge: true
});

// Apply basic auth to admin routes
app.use('/api/v1/verses/admin', adminAuth);

// API routes
app.use('/api/v1/verses', verseRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Initialize Elasticsearch index and start server
const PORT = process.env.PORT || 3000;

initializeIndex()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Failed to initialize OpenSearch:', error);
        process.exit(1);
    });