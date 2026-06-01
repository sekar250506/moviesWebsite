const express = require("express");
const path = require("path");
const movies = require("./movies_metadata.json");

const app = express();
app.use(express.json());

// Health check
app.get("/api/ping", (req, res) => {
  console.log("❇️ GET /api/ping");
  res.send("pong!");
});

// List all movies (summary fields only)
app.get("/api/movies", (req, res) => {
  console.log("❇️ GET /api/movies");
  const list = movies.map(({ id, title, tagline, vote_average }) => ({
    id,
    title,
    tagline,
    vote_average,
  }));
  res.json(list);
});

// Get single movie by ID
app.get("/api/movies/:id", (req, res) => {
  console.log(`❇️ GET /api/movies/${req.params.id}`);
  const movie = movies.find((m) => String(m.id) === String(req.params.id));
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  res.json(movie);
});

// Express port-switching logic
let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
}

const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});
