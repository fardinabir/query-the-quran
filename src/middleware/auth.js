const basicAuth = require('express-basic-auth');
const config = require('../config');

// Basic auth middleware for admin routes
const adminAuth = basicAuth({
    users: { [config.admin.username]: config.admin.password },
    challenge: true
});

module.exports = adminAuth;