const verseService = require('../../services/user/verseService');

// Search verses
async function searchVerses(req, res) {
    try {
        const { q = req.query.query, from = 0, size = 10 } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const results = await verseService.searchVerses(q, parseInt(from), parseInt(size));
        res.json(results);
    } catch (error) {
        console.error('Error in searchVerses controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get search suggestions
async function getSuggestions(req, res) {
    try {
        const { q = req.query.query, field = 'ayat_text_english' } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const suggestions = await verseService.getSuggestions(q, field);
        res.json(suggestions);
    } catch (error) {
        console.error('Error in getSuggestions controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    searchVerses,
    getSuggestions
};