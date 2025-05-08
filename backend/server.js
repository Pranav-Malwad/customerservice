// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB setup
mongoose.connect('mongodb+srv://pranavreddy:Pranav%40123@cluster0.wnpyypb.mongodb.net/?retryWrites=true&w=majority&appName=thejuicefarm')

  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Song model
const songSchema = new mongoose.Schema({
  songName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Song = mongoose.model('Song', songSchema);

// Routes

// Get all song suggestions
app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 }); // Sort by the most recent
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// Add a new song suggestion
app.post('/api/songs', async (req, res) => {
  const { songName } = req.body;

  if (!songName || songName.trim() === '') {
    return res.status(400).json({ error: 'Song name is required' });
  }

  try {
    const newSong = new Song({ songName });
    await newSong.save();
    res.status(201).json(newSong);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save song' });
  }
});

// Delete a song suggestion
app.delete('/api/songs/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.status(200).json({ message: 'Song deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete song' });
  }
});


// Feedback schema & model
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Submit feedback
app.post('/api/feedback', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const feedback = new Feedback({ name, email, message });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// Get feedback (optional, for admin view)
app.get('/api/feedback', async (req, res) => {
  try {
    const allFeedback = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(allFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
