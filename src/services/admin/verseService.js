const client = require('../../utils/elasticsearch/config').client;

// Bulk index verses
async function bulkIndexVerses(verses) {
    // Delete existing index first
    try {
        const indexExists = await client.indices.exists({
            index: process.env.ELASTICSEARCH_INDEX
        });

        if (indexExists) {
            await client.indices.delete({
                index: process.env.ELASTICSEARCH_INDEX
            });
            console.log('Existing index deleted');
        }

        // Recreate index with mapping
        const { initializeIndex } = require('../../utils/elasticsearch/config');
        await initializeIndex();
        console.log('Index recreated with mapping');
    } catch (error) {
        console.error('Error managing index:', error);
        throw error;
    }

    const operations = verses.flatMap(verse => [
        { index: { _index: process.env.ELASTICSEARCH_INDEX } },
        verse
    ]);

    const bulkResponse = await client.bulk({ refresh: true, operations });

    if (bulkResponse.errors) {
        const erroredDocuments = [];
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0];
            if (action[operation].error) {
                erroredDocuments.push({
                    status: action[operation].status,
                    error: action[operation].error,
                    operation: operations[i * 2],
                    document: operations[i * 2 + 1]
                });
            }
        });
        console.error('Failed documents:', erroredDocuments);
        throw new Error('Failed to index some documents');
    }

    return bulkResponse;
}

// Get cluster health
async function getClusterHealth() {
    const health = await client.cluster.health();
    return health;
}

module.exports = {
    bulkIndexVerses,
    getClusterHealth
};