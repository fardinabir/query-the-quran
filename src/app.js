const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeIndex } = require('./utils/elasticsearch/config');
const adminAuth = require('./middleware/auth');
const adminRoutes = require('./routes/admin/verseRoutes');
const userRoutes = require('./routes/user/verseRoutes');

const app = express();

// Enable CORS
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public/user'));

// Admin routes and static files with authentication
app.use('/admin', adminAuth, express.static('public/admin'));
app.use('/api/v1/verses/admin', adminAuth, adminRoutes);

// User routes
app.use('/api/v1/verses', userRoutes);

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