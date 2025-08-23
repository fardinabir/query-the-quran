const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
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

// Serve static files from public/user directory
app.use(express.static('public/user'));

// Redirect root URL to index.html
app.get('/', (req, res) => {
    res.redirect('/user/index.html');
});

// Admin routes and static files with authentication
app.use('/admin', adminAuth, express.static('public/admin'));
app.use('/api/v1/admin', adminAuth, adminRoutes);

// User routes
app.use('/api/v1/verses', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Initialize Elasticsearch index and start server
initializeIndex()
    .then(() => {
        app.listen(config.server.port, () => {
            console.log(`Server is running on port ${config.server.port}`);
        });
    })
    .catch(error => {
        console.error('Failed to initialize OpenSearch:', error);
        process.exit(1);
    });