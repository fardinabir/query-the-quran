require('dotenv').config();

const config = {
    elasticsearch: {
        node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
        index: process.env.ELASTICSEARCH_INDEX || 'quran_verses',
        auth: {
            username: process.env.ELASTICSEARCH_USERNAME,
            password: process.env.ELASTICSEARCH_PASSWORD
        },
        tls: {
            rejectUnauthorized: process.env.ELASTICSEARCH_REJECT_UNAUTHORIZED === 'true'
        }
    },
    admin: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD
    },
    server: {
        port: process.env.PORT || 3000
    }
};

// Validate required environment variables
const requiredEnvVars = [
    'ELASTICSEARCH_USERNAME',
    'ELASTICSEARCH_PASSWORD',
    'ADMIN_PASSWORD'
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

module.exports = config;