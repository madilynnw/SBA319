const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/musicdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import models
const User = require("./models/User");
const Album = require("./models/Album");
const Review = require("./models/Review");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// PORT
const PORT = 3000;
