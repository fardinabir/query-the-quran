const elasticsearchService = require('../utils/elasticsearch/service');

module.exports = {
    indexVerse: elasticsearchService.indexVerse,
    bulkIndexVerses: elasticsearchService.bulkIndexVerses,
    searchVerses: elasticsearchService.searchVerses,
    getSuggestions: elasticsearchService.getSuggestions,
    getClusterHealth: elasticsearchService.getClusterHealth
};