const readVerseService = require('../../services/user/readVerseService');

async function getConsecutiveVerses(req, res) {
    try {
        const { id = 1 } = req.query;
        const startId = parseInt(id);
        
        if (isNaN(startId) || startId < 1) {
            return res.status(400).json({ error: 'Invalid verse ID' });
        }

        const results = await readVerseService.getConsecutiveVerses(startId);
        res.json(results);
    } catch (error) {
        console.error('Error in getConsecutiveVerses controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getConsecutiveVerses
};