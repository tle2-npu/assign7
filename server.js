const express = require("express");
const { db, Track } = require("./database/setup");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Test database connection
async function testConnection() {
    try {
        await db.authenticate();
        console.log('Connection to database established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

// GET /api/tracks - Get all tracks 
app.get("/api/tracks", async (req, res) => {
    try {
        const tracks = await Track.findAll();
        res.json(tracks);
    } catch (error) {
        console.error('Error fetching tracks:', error);
        res.status(500).json({ error: 'Failed to fetch tracks' });
    }
});

// GET /api/tracks/:id - Get track by ID
app.get("/api/tracks/:id", async (req, res) => {
    try {
        const track = await Track.findByPk(req.params.id);

        if (!track) {
            return res.status(404).json({ error: "Track not found" });
        }

        res.json(track);
    } catch (error) {
        console.error('Error fetching track:', error);
        res.status(500).json({ error: 'Failed to fetch track' });
    }
});

// POST /api/tracks - Create new track
app.post("/api/tracks", async (req, res) => {
    try {

        const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

        if (!songTitle || !artistName || !albumName || !genre) {
            return res.status(400).json({
                error: "songTitle, artistName, albumName, and genre are required"
            });
        }

        const newTrack = await Track.create({
            songTitle,
            artistName,
            albumName,
            genre,
            duration,
            releaseYear
        });

        res.status(201).json(newTrack);

    } catch (error) {
        console.error('Error creating track:', error);
        res.status(500).json({ error: "Failed to create track" });
    }
});

// PUT /api/tracks/:id - Update an existing track
app.put("/api/tracks/:id", async (req, res) => {
    try {

        const [updated] = await Track.update(req.body, {
            where: { trackId: req.params.id }
        });

        if (updated === 0) {
            return res.status(404).json({ error: "Track not found" });
        }

        const updatedTrack = await Track.findByPk(req.params.id);

        res.json(updatedTrack);

    } catch (error) {
        console.error('Error updating track:', error);
        res.status(500).json({ error: "Failed to update track" });
    }
});

// DELETE /api/tracks/:id - Delete a track
app.delete("/api/tracks/:id", async (req, res) => {
    try {

        const deleted = await Track.destroy({
            where: { trackId: req.params.id }
        });

        if (deleted === 0) {
            return res.status(404).json({ error: "Track not found" });
        }

        res.json({ message: "Track deleted successfully" });

    } catch (error) {
        console.error('Error deleting track:', error);
        res.status(500).json({ error: "Failed to delete track" });
    }
});