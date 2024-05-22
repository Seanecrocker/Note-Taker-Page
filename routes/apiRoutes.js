const router = require('express').Router();
const fs = require('fs');
const path = require('path');

// API route to read the db.json file and return all saved notes as JSON
router.get('/notes', (req, res) => {
    // Read the db.json file
    fs.readFile(path.join(__dirname, '../db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Parse the JSON data and send it as the response
        res.json(JSON.parse(data));
    });
});

// API route to receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client
router.post('/notes', (req, res) => {
    const newNote = req.body;

    // Read the current notes from the db.json file
    fs.readFile(path.join(__dirname, '../db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Parse the JSON data
        const notes = JSON.parse(data);

        // Assign a unique id to the new note
        newNote.id = Date.now();

        // Add the new note to the notes array
        notes.push(newNote);

        // Write the updated notes array back to the db.json file
        fs.writeFile(path.join(__dirname, '../db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            // Send the new note as the response
            res.json(newNote);
        });
    });
});

module.exports = router;
