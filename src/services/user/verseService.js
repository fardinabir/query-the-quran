const client = require('../../utils/elasticsearch/config').client;

// Search verses with highlighting
async function searchVerses(query, from = 0, size = 10) {
    const result = await client.search({
        index: process.env.ELASTICSEARCH_INDEX,
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
    });

    return {
        total: result.hits.total,
        hits: result.hits.hits.map(hit => ({
            _source: hit._source,
            highlight: hit.highlight
        }))
    };
}

// Get search suggestions
async function getSuggestions(query, field) {
    const result = await client.search({
        index: process.env.ELASTICSEARCH_INDEX,
        size: 5,
        query: {
            match_phrase_prefix: {
                [field]: {
                    query,
                    max_expansions: 10
                }
            }
        },
        _source: [field]
    });

    return result.hits.hits.map(hit => ({ text: hit._source[field] }));
}

module.exports = {
    searchVerses,
    getSuggestions
};