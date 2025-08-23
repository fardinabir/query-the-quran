const { Client } = require('@elastic/elasticsearch');
const config = require('../../config');

const client = new Client({
    node: config.elasticsearch.node,
    auth: config.elasticsearch.auth,
    tls: config.elasticsearch.tls
});

// Mapping for Quran verses with appropriate analyzers
const versesMapping = {
    settings: {
        number_of_shards: 1,
        number_of_replicas: 0,
        analysis: {
            analyzer: {
                arabic_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: [
                        'lowercase',
                        'decimal_digit',
                        'arabic_normalization',
                        'arabic_stemmer'
                    ]
                },
                bangla_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: [
                        'lowercase',
                        'indic_normalization',
                        'bengali_normalization',
                        'stop',
                        'snowball'
                    ]
                },
                completion_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'word_delimiter']
                }
            },
            filter: {
                arabic_stemmer: {
                    type: 'stemmer',
                    language: 'arabic'
                },
                bengali_normalization: {
                    type: 'bengali_normalization'
                }
            }
        }
    },
    mappings: {
        properties: {
            id: { type: 'keyword' },
            sura_no: { type: 'integer' },
            verse_no: { type: 'integer' },
            ayat_text_arabic: {
                type: 'text',
                analyzer: 'arabic_analyzer',
                search_analyzer: 'arabic_analyzer',
                fields: {
                    completion: {
                        type: 'completion',
                        analyzer: 'completion_analyzer'
                    },
                    keyword: {
                        type: 'keyword',
                        ignore_above: 256
                    }
                }
            },
            ayat_text_english: {
                type: 'text',
                analyzer: 'english',
                fields: {
                    completion: {
                        type: 'completion',
                        analyzer: 'completion_analyzer'
                    },
                    keyword: {
                        type: 'keyword',
                        ignore_above: 256
                    }
                }
            },
            ayat_text_bangla: {
                type: 'text',
                analyzer: 'bangla_analyzer',
                search_analyzer: 'bangla_analyzer',
                fields: {
                    completion: {
                        type: 'completion',
                        analyzer: 'completion_analyzer'
                    },
                    keyword: {
                        type: 'keyword',
                        ignore_above: 256
                    }
                }
            }
        }
    }
};

// Initialize Elasticsearch index
async function initializeIndex() {
    try {
        // Check if index exists
        const indexExists = await client.indices.exists({
            index: config.elasticsearch.index
        });

        if (!indexExists) {
            const createResponse = await client.indices.create({
                index: config.elasticsearch.index,
                body: versesMapping
            });
            console.log('Index created successfully:', createResponse);
        } else {
            console.log('Index already exists');
        }

        // Get cluster health after index operations
        const health = await client.cluster.health();
        console.log('Elasticsearch cluster health:', health);
    } catch (error) {
        console.error('Error initializing Elasticsearch:', error.message);
        if (error.meta && error.meta.body) {
            console.error('Elasticsearch error details:', JSON.stringify(error.meta.body, null, 2));
        }
        throw error;
    }
}

module.exports = {
    client,
    initializeIndex
};