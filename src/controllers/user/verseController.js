const verseService = require('../../services/user/verseService');

// Search verses
async function searchVerses(req, res) {
    try {
        const { q = req.query.query, from = 0, size = 10 } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        // Start timing
        const startTime = performance.now();
        
        const results = await verseService.searchVerses(q, parseInt(from), parseInt(size));
        
        // End timing and calculate duration
        const endTime = performance.now();
        const queryTime = endTime - startTime;
        
        // Log the performance data
        console.log(`[PERFORMANCE] Search query: "${q}" took ${queryTime.toFixed(2)}ms with ${results.hits?.length || 0} results`);
        
        res.json(results);
    } catch (error) {
        console.error('Error in searchVerses controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    searchVerses
};