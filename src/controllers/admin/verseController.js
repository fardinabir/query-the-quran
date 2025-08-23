const verseService = require('../../services/admin/verseService');
const { parse } = require('csv-parse');
const fs = require('fs');

// Upload and index CSV data
async function uploadAndIndexCSV(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const records = [];
        fs.createReadStream(req.file.path)
            .pipe(parse({ columns: true, skip_empty_lines: true }))
            .on('data', (record) => records.push(record))
            .on('end', async () => {
                try {
                    await verseService.bulkIndexVerses(records);
                    // Clean up uploaded file
                    fs.unlink(req.file.path, (err) => {
                        if (err) console.error('Error deleting temporary file:', err);
                    });
                    res.json({ status: 'success', message: `Indexed ${records.length} verses` });
                } catch (error) {
                    console.error('Error indexing verses:', error);
                    res.status(500).json({ error: 'Failed to index verses' });
                }
            })
            .on('error', (error) => {
                console.error('Error parsing CSV:', error);
                res.status(500).json({ error: 'Failed to parse CSV file' });
            });
    } catch (error) {
        console.error('Error in uploadAndIndexCSV:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get cluster health
async function getClusterHealth(req, res) {
    try {
        const health = await verseService.getClusterHealth();
        res.json({ status: 'success', health });
    } catch (error) {
        console.error('Error in getClusterHealth:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    uploadAndIndexCSV,
    getClusterHealth
};