const basicAuth = require('express-basic-auth');

// Basic auth middleware for admin routes
const adminAuth = basicAuth({
    users: { 'admin': process.env.ADMIN_PASSWORD || 'admin123' },
    challenge: true
});

module.exports = adminAuth;