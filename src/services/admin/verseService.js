const client = require('../../utils/elasticsearch/config').client;

// Bulk index verses
async function bulkIndexVerses(verses) {
    const operations = verses.flatMap(verse => [
        { index: { _index: process.env.ELASTICSEARCH_INDEX } },
        verse
    ]);

    const { body: bulkResponse } = await client.bulk({ refresh: true, body: operations });

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
    const { body } = await client.cluster.health();
    return body;
}

module.exports = {
    bulkIndexVerses,
    getClusterHealth
};