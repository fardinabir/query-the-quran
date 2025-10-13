const { Client } = require('@elastic/elasticsearch');
const config = require('../../config');

// Create Elasticsearch client with optimized configuration
const client = new Client({
    node: config.elasticsearch.node,
    auth: config.elasticsearch.auth,
    tls: config.elasticsearch.tls,
    maxRetries: 5,
    requestTimeout: 60000,
    // Add compression for better performance
    compression: 'gzip',
    // Enable keep-alive for connection reuse
    agent: {
        keepAlive: true,
        keepAliveMsecs: 1000,
        maxSockets: 256,
        maxFreeSockets: 256
    }
});

// Optimized mapping for Quran verses with appropriate analyzers
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
            id: { type: 'integer' },
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

// Wait until Elasticsearch is ready (yellow or green) with retries
async function waitForElasticsearchReady({ 
    maxRetries = 20, 
    initialDelayMs = 1000, 
    maxDelayMs = 10000,
    backoffMultiplier = 1.5 
} = {}) {
    let currentDelay = initialDelayMs;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Use info() instead of ping() for more comprehensive health check
            const info = await client.info();
            
            // Check cluster health
            const health = await client.cluster.health({
                wait_for_status: 'yellow',
                timeout: '5s'
            });
            
            if (health?.status === 'yellow' || health?.status === 'green') {
                console.log(`✅ Elasticsearch ready (v${info.version.number}, status: ${health.status})`);
                return;
            }
            
            throw new Error(`Cluster status is ${health?.status || 'unknown'}`);
            
        } catch (error) {
            
            if (attempt === maxRetries) {
                console.error(`❌ Elasticsearch failed to become ready after ${maxRetries} attempts`);
                throw new Error(`Elasticsearch not ready: ${error.message}`);
            }
            
            console.log(`⏳ Elasticsearch not ready (attempt ${attempt}/${maxRetries}): ${error.message}. Retrying in ${currentDelay}ms...`);
            
            await new Promise(resolve => setTimeout(resolve, currentDelay));
            
            // Exponential backoff with max delay cap
            currentDelay = Math.min(currentDelay * backoffMultiplier, maxDelayMs);
        }
    }
}

async function initializeIndex() {
    const indexName = config.elasticsearch.index;
    
    try {
        console.log(`🔄 Initializing Elasticsearch index: ${indexName}`);
        
        // Ensure Elasticsearch is ready before any operations
        await waitForElasticsearchReady();
        
        // Check if index exists
        const { body: indexExists } = await client.indices.exists({
            index: indexName
        }).catch(() => ({ body: false }));
        
        if (!indexExists) {
            console.log(`📝 Creating index: ${indexName}`);
            
            const createResponse = await client.indices.create({
                index: indexName,
                body: versesMapping
            });
            
            console.log(`✅ Index created successfully: ${indexName}`, {
                acknowledged: createResponse.acknowledged,
                shards_acknowledged: createResponse.shards_acknowledged
            });
        } else {
            console.log(`ℹ️  Index already exists: ${indexName}`);
            
            // Optionally verify mapping is up to date
            try {
                const { body: currentMapping } = await client.indices.getMapping({
                    index: indexName
                });
                console.log(`📋 Current mapping verified for index: ${indexName}`);
            } catch (mappingError) {
                console.warn(`⚠️  Could not verify mapping for ${indexName}:`, mappingError.message);
            }
        }
        
        // Final health check
        const { body: finalHealth } = await client.cluster.health({ 
            wait_for_status: 'yellow', 
            timeout: '10s' 
        });
        
        console.log(`🏥 Elasticsearch cluster health:`, {
            status: finalHealth.status,
            number_of_nodes: finalHealth.number_of_nodes,
            active_primary_shards: finalHealth.active_primary_shards,
            active_shards: finalHealth.active_shards
        });
        
    } catch (error) {
        console.error(`❌ Failed to initialize Elasticsearch index: ${indexName}`, {
            message: error.message,
            type: error.name,
            statusCode: error.statusCode
        });
        
        // Log additional error details if available
        if (error.meta?.body) {
            console.error('📋 Elasticsearch error details:', 
                JSON.stringify(error.meta.body, null, 2)
            );
        }
        
        throw new Error(`Elasticsearch initialization failed: ${error.message}`);
    }
}

async function closeConnection() {
    try {
        await client.close();
        console.log('🔌 Elasticsearch connection closed gracefully');
    } catch (error) {
        console.error('⚠️  Error closing Elasticsearch connection:', error.message);
    }
}

// Handle process termination gracefully
process.on('SIGTERM', closeConnection);
process.on('SIGINT', closeConnection);

module.exports = {
    client,
    waitForElasticsearchReady,
    initializeIndex,
    closeConnection,
    // Export mapping for testing purposes
    versesMapping
};