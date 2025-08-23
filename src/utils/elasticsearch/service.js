const { client } = require('../elasticsearch/config');

// Index a single verse
async function indexVerse(verse) {
    try {
        const { body } = await client.index({
            index: process.env.ELASTICSEARCH_INDEX,
            body: verse
        });
        return body;
    } catch (error) {
        console.error('Error indexing verse:', error);
        throw error;
    }
}

// Bulk index verses
async function bulkIndexVerses(verses) {
    try {
        const operations = verses.flatMap(verse => [
            { index: { _index: process.env.ELASTICSEARCH_INDEX } },
            verse
        ]);

        const { body } = await client.bulk({ body: operations });
        return body;
    } catch (error) {
        console.error('Error bulk indexing verses:', error);
        throw error;
    }
}

// Search verses with highlighting
async function searchVerses(query, from = 0, size = 10) {
    try {
        const { body } = await client.search({
            index: process.env.ELASTICSEARCH_INDEX,
            body: {
                from,
                size,
                query: {
                    bool: {
                        should: [
                            {
        multi_match: {
            query,
            fields: ['ayat_text_arabic^3', 'ayat_text_english^2', 'ayat_text_bangla'],
            type: 'best_fields',
            fuzziness: 'AUTO'
        }
    },
    {
        multi_match: {
            query,
                                    fields: ['ayat_text_arabic.keyword^3', 'ayat_text_english.keyword^2', 'ayat_text_bangla.keyword'],
            type: 'phrase'
        }
    }
                        ]
                    }
                },
                highlight: {
                    pre_tags: ['<mark>'],
                    post_tags: ['</mark>'],
                    fields: {
                        ayat_text_arabic: { number_of_fragments: 0 },
                        ayat_text_english: { number_of_fragments: 0 },
                        ayat_text_bangla: { number_of_fragments: 0 }
                    }
                }
            }
        });

        return {
            hits: body.hits.hits,
            total: body.hits.total,
            took: body.took
        };
    } catch (error) {
        console.error('Error searching verses:', error);
        throw error;
    }
}

// Get search suggestions
async function getSuggestions(prefix, field = 'ayat_text_english') {
    try {
        const { body } = await client.search({
            index: process.env.ELASTICSEARCH_INDEX,
            body: {
                size: 5,
                _source: [field],
                suggest: {
                    text: prefix,
                    verse_suggestions: {
                        completion: {
                            field: `${field}.completion`,
                            size: 5,
                            skip_duplicates: true,
                            fuzzy: {
                                fuzziness: 'AUTO'
                            }
                        }
                    }
                }
            }
        });

        return body.suggest.verse_suggestions[0].options;
    } catch (error) {
        console.error('Error getting suggestions:', error);
        throw error;
    }
}

// Get cluster health
async function getClusterHealth() {
    try {
        const { body } = await client.cluster.health();
        return body;
    } catch (error) {
        console.error('Error getting cluster health:', error);
        throw error;
    }
}

module.exports = {
    indexVerse,
    bulkIndexVerses,
    searchVerses,
    getSuggestions,
    getClusterHealth
};