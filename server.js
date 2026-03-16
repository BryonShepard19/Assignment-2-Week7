const express = require("express");
require("dotenv").config();

const { sequelize, Track } = require("./database/setup");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// GET all tracks
app.get("/api/tracks", async (req, res) => {
  try {
    const tracks = await Track.findAll();
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tracks." });
  }
});

// GET track by id
app.get("/api/tracks/:id", async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);

    if (!track) {
      return res.status(404).json({ error: "Track not found." });
    }

    res.json(track);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve track." });
  }
});

// POST new track
app.post("/api/tracks", async (req, res) => {
  try {
    const {
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear,
    } = req.body;

    if (!songTitle || !artistName || !albumName || !genre) {
      return res.status(400).json({
        error: "songTitle, artistName, albumName, and genre are required.",
      });
    }

    const newTrack = await Track.create({
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear,
    });

    res.status(201).json(newTrack);
  } catch (error) {
    res.status(500).json({ error: "Failed to create track." });
  }
});

// PUT update track
app.put("/api/tracks/:id", async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);

    if (!track) {
      return res.status(404).json({ error: "Track not found." });
    }

    const {
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear,
    } = req.body;

    await track.update({
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear,
    });

    res.json(track);
  } catch (error) {
    res.status(500).json({ error: "Failed to update track." });
  }
});

// DELETE track
app.delete("/api/tracks/:id", async (req, res) => {
  try {
    const deletedRows = await Track.destroy({
      where: { trackId: req.params.id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Track not found." });
    }

    res.json({ message: "Track deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete track." });
  }
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
}

startServer();