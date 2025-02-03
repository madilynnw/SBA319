const express = require("express");
const User = require("./models/User");
const Album = require("./models/Album");
const Review = require("./models/Review");

const router = express.Router();

// --- GET Routes ---

// Retrieve all albums
router.get("/albums", async (req, res) => {
  try {
    const albums = await Album.find(); // Fetch all albums
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: "Error fetching albums" });
  }
});

// Retrieve a specific album by ID
router.get("/albums/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found" });
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: "Error fetching album" });
  }
});

// Retrieve all reviews for a specific album
router.get("/reviews/:albumId", async (req, res) => {
  try {
    const reviews = await Review.find({ album: req.params.albumId }).populate(
      "user",
      "username"
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Error fetching reviews for this album" });
  }
});

// --- POST Routes ---

// Create a new album
router.post("/albums", async (req, res) => {
  const { title, artist, genre, releaseDate, tracklist } = req.body;
  try {
    const newAlbum = new Album({
      title,
      artist,
      genre,
      releaseDate,
      tracklist,
    });
    await newAlbum.save();
    res.status(201).json(newAlbum);
  } catch (err) {
    res.status(400).json({ error: "Error creating album" });
  }
});

// Create a new review
router.post("/reviews", async (req, res) => {
  const { albumId, userId, rating, comment } = req.body;
  try {
    const newReview = new Review({
      album: albumId,
      user: userId,
      rating,
      comment,
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ error: "Error creating review" });
  }
});

// Create a new user
router.post("/users", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: "Error creating user" });
  }
});

// --- PATCH and PUT Routes ---

// Update an existing album's information (PUT)
router.put("/albums/:id", async (req, res) => {
  const { title, artist, genre, releaseDate, tracklist } = req.body;
  try {
    const updatedAlbum = await Album.findByIdAndUpdate(
      req.params.id,
      { title, artist, genre, releaseDate, tracklist },
      { new: true } // Return the updated document
    );
    if (!updatedAlbum)
      return res.status(404).json({ error: "Album not found" });
    res.json(updatedAlbum);
  } catch (err) {
    res.status(400).json({ error: "Error updating album" });
  }
});

// Update a review (PATCH)
router.patch("/reviews/:id", async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true }
    );
    if (!updatedReview)
      return res.status(404).json({ error: "Review not found" });
    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ error: "Error updating review" });
  }
});

// --- DELETE Routes ---

// Delete a specific album by ID
router.delete("/albums/:id", async (req, res) => {
  try {
    const deletedAlbum = await Album.findByIdAndDelete(req.params.id);
    if (!deletedAlbum)
      return res.status(404).json({ error: "Album not found" });
    res.json({ message: "Album deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting album" });
  }
});

// Delete a specific review by ID
router.delete("/reviews/:id", async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview)
      return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting review" });
  }
});

module.exports = router;
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/musicdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use the routes
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
