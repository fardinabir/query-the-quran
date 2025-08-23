const { Client } = require('@opensearch-project/opensearch');
require('dotenv').config();

const client = new Client({
    node: process.env.ELASTICSEARCH_NODE,
    ssl: { rejectUnauthorized: false },
    auth: {
        username: 'admin',
        password: 'admin'
    }
});

// Mapping for Quran verses with appropriate analyzers
const versesMapping = {
    settings: {
        number_of_shards: 1,
        number_of_replicas: 0
    },
    mappings: {
        properties: {
            id: { type: 'keyword' },
            sura_no: { type: 'integer' },
            verse_no: { type: 'integer' },
            ayat_text_arabic: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                    completion: {
                        type: 'completion',
                        analyzer: 'standard'
                    }
                }
            },
            ayat_text_english: {
                type: 'text',
                analyzer: 'english',
                fields: {
                    completion: {
                        type: 'completion',
                        analyzer: 'standard'
                    }
                }
            },
            ayat_text_bangla: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                    completion: {
                        type: 'completion',
                        analyzer: 'standard'
                    }
                }
            }
        }
    }
};

// Initialize OpenSearch index
async function initializeIndex() {
    try {
        // Check if index exists
        const { body: indexExists } = await client.indices.exists({
            index: process.env.ELASTICSEARCH_INDEX
        });

        if (!indexExists) {
            const { body: createResponse } = await client.indices.create({
                index: process.env.ELASTICSEARCH_INDEX,
                body: versesMapping
            });
            console.log('Index created successfully:', createResponse);
        } else {
            console.log('Index already exists');
        }

        // Get cluster health after index operations
        const { body: health } = await client.cluster.health();
        console.log('OpenSearch cluster health:', health);
    } catch (error) {
        console.error('Error initializing OpenSearch:', error.message);
        if (error.body) {
            console.error('OpenSearch error details:', error.body);
        }
        throw error;
    }
}

module.exports = {
    client,
    initializeIndex
};