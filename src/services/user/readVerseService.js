const client = require('../../utils/elasticsearch/config').client;

async function getConsecutiveVerses(startId, count = 5) {
    try {
        const result = await client.search({
            index: process.env.ELASTICSEARCH_INDEX,
            body: {
                query: {
                    range: {
                        id: {
                            gte: startId,
                            lt: startId + count
                        }
                    }
                },
                sort: [{ id: 'asc' }],
                size: count
            }
        });

        return {
            total: result.hits.total,
            hits: result.hits.hits.map(hit => hit._source)
        };
    } catch (error) {
        console.error('Error fetching consecutive verses:', error);
        throw error;
    }
}

module.exports = {
    getConsecutiveVerses
};