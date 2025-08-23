const verseService = require('../services/verseService');
const { parse } = require('csv-parse');
const fs = require('fs');

// Search verses with pagination
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

// Upload and index CSV data
async function uploadAndIndexCSV(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const verses = [];
        const parser = fs
            .createReadStream(req.file.path)
            .pipe(parse({
                columns: true,
                skip_empty_lines: true
            }));

        for await (const record of parser) {
            verses.push({
                id: record.id,
                sura_no: parseInt(record.sura_no),
                verse_no: parseInt(record.verse_no),
                ayat_text_arabic: record.ayat_text_arabic,
                ayat_text_english: record.ayat_text_english,
                ayat_text_bangla: record.ayat_text_bangla
            });
        }

        // Clean up the temporary file
        fs.unlinkSync(req.file.path);

        if (verses.length === 0) {
            return res.status(400).json({ error: 'No valid records found in CSV' });
        }
        console.log('verses ----------', verses[6235]);
        const response = await verseService.bulkIndexVerses(verses);
        res.json({
            message: 'CSV data indexed successfully',
            verses_count: verses.length,
            bulk_response: response
        });
    } catch (error) {
        console.error('Error in uploadAndIndexCSV controller:', error);
        // Clean up the temporary file in case of error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Error processing CSV file' });
    }
}

// Get cluster health
async function getClusterHealth(req, res) {
    try {
        const health = await verseService.getClusterHealth();
        res.json({ status: 'success', health });
    } catch (error) {
        console.error('Error in getClusterHealth controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    searchVerses,
    getSuggestions,
    uploadAndIndexCSV,
    getClusterHealth
};