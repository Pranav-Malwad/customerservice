// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// // Initialize Express app
// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB setup
// mongoose.connect('mongodb+srv://pranavreddy:Pranav%40123@cluster0.wnpyypb.mongodb.net/?retryWrites=true&w=majority&appName=thejuicefarm')

//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('Could not connect to MongoDB', err));

// // Song model
// const songSchema = new mongoose.Schema({
//   songName: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const Song = mongoose.model('Song', songSchema);

// // Routes

// // Get all song suggestions
// app.get('/api/songs', async (req, res) => {
//   try {
//     const songs = await Song.find().sort({ createdAt: -1 }); // Sort by the most recent
//     res.status(200).json(songs);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch songs' });
//   }
// });

// // Add a new song suggestion
// app.post('/api/songs', async (req, res) => {
//   const { songName } = req.body;

//   if (!songName || songName.trim() === '') {
//     return res.status(400).json({ error: 'Song name is required' });
//   }

//   try {
//     const newSong = new Song({ songName });
//     await newSong.save();
//     res.status(201).json(newSong);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to save song' });
//   }
// });

// // Delete a song suggestion
// app.delete('/api/songs/:id', async (req, res) => {
//   try {
//     const song = await Song.findByIdAndDelete(req.params.id);
//     if (!song) {
//       return res.status(404).json({ error: 'Song not found' });
//     }
//     res.status(200).json({ message: 'Song deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to delete song' });
//   }
// });


// // Feedback schema & model
// const feedbackSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   message: String,
//   createdAt: { type: Date, default: Date.now },
// });

// const Feedback = mongoose.model('Feedback', feedbackSchema);

// // Submit feedback
// app.post('/api/feedback', async (req, res) => {
//   const { name, email, message } = req.body;
//   if (!name || !email || !message) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   try {
//     const feedback = new Feedback({ name, email, message });
//     await feedback.save();
//     res.status(201).json({ message: 'Feedback submitted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to save feedback' });
//   }
// });

// // Get feedback (optional, for admin view)
// app.get('/api/feedback', auth, isAdmin, async (req, res) => {
//   try {
//     const allFeedback = await Feedback.find().sort({ createdAt: -1 });
//     res.status(200).json(allFeedback);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch feedback' });
//   }
// });


// // middleware/auth.js
// const jwt = require('jsonwebtoken');

// const auth = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
//   if (!token) return res.status(401).json({ error: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, 'your_jwt_secret');
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(403).json({ error: 'Invalid token' });
//   }
// };

// const isAdmin = (req, res, next) => {
//   if (req.user?.role === 'admin') return next();
//   return res.status(403).json({ error: 'Admin access required' });
// };

// module.exports = { auth, isAdmin };


// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, default: 'user' }, // 'admin' or 'user'
// });

// module.exports = mongoose.model('User', userSchema);

// const User = mongoose.model('User', userSchema);

// // Server setup
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'jwt-secret'; // Use env in real apps

// MongoDB connection
mongoose.connect('mongodb+srv://pranavreddy:Pranav%40123@cluster0.wnpyypb.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// ========================
// MODELS
// ========================

// Song model
const songSchema = new mongoose.Schema({
  songName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Song = mongoose.model('Song', songSchema);

// Feedback model
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

// User/Admin model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // 'admin' or 'user'
});
const User = mongoose.model('User', userSchema);

// ========================
// MIDDLEWARES
// ========================
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ error: 'Admin access required' });
};

// ========================
// ROUTES
// ========================

// 🎵 SONG ROUTES
app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

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

// ✉️ FEEDBACK ROUTES
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

app.get('/api/feedback', auth, isAdmin, async (req, res) => {
  try {
    const allFeedback = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(allFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// 🔐 ADMIN AUTH ROUTES

// Register admin (optional: remove in production)
app.post('/api/register-admin', async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ error: 'Username already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const newAdmin = new User({ username, password: hashed, role: 'admin' });

  await newAdmin.save();
  res.status(201).json({ message: 'Admin registered successfully' });
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.status(200).json({ token, user: { username: user.username, role: user.role } });
});

// GET all snack suggestions (admin only)
app.get("/api/snack-suggestions", auth, isAdmin, async (req, res) => {
  try {
    const suggestions = await SnackSuggestion.find().sort({ createdAt: -1 });
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch snack suggestions" });
  }
});

// DELETE a snack suggestion by ID (admin only)
app.delete("/api/snack-suggestions/:id", auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SnackSuggestion.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Suggestion not found" });
    res.status(200).json({ message: "Suggestion deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete snack suggestion" });
  }
});


// Song Queue Schema
const songQueueSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  thumbnail: String,
});

// Create model
const SongQueue = mongoose.model('SongQueue', songQueueSchema);

// API Routes

// Add song to the queue
app.post("/api/add-to-queue", async (req, res) => {
  try {
    const { videoId, title, thumbnail } = req.body;

    const newSong = new SongQueue({
      videoId,
      title,
      thumbnail,
    });

    await newSong.save();
    res.status(201).json({ message: "Song added to queue!", song: newSong });
  } catch (error) {
    res.status(500).json({ message: "Error adding song to queue", error });
  }
});

// Get current queue
app.get("/api/get-queue", async (req, res) => {
  try {
    const queue = await SongQueue.find();
    res.status(200).json({ queue });
  } catch (error) {
    res.status(500).json({ message: "Error fetching queue", error });
  }
});

// Clear the queue (after song is played)
app.delete("/api/clear-queue", async (req, res) => {
  try {
    await SongQueue.deleteMany({});
    res.status(200).json({ message: "Queue cleared!" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing queue", error });
  }
});

// DELETE a single song from the queue by videoId
app.delete("/api/delete-song/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const result = await SongQueue.deleteOne({ videoId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Song not found in queue" });
    }

    res.status(200).json({ message: "Song deleted from queue" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting song", error });
  }
});


// Set up a basic home route
app.get("/", (req, res) => {
  res.send("YouTube Jukebox Backend");
});



const SnackPollSchema = new mongoose.Schema({
  snack: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SnackPoll = mongoose.model('SnackPoll', SnackPollSchema);

// API
app.post('/api/snackpoll', async (req, res) => {
  const { snack } = req.body;
  if (!snack || snack.trim() === '') {
    return res.status(400).json({ error: 'Snack is required' });
  }

  try {
    await SnackPoll.create({ snack: snack.trim() });
    res.status(200).json({ message: 'Submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});
// queue stroe 

// ========================
// SERVER START
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
