const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// Load movies data from JSON file
let moviesData = [];
try {
  const rawData = fs.readFileSync(
    path.join(__dirname, "movies_metadata.json"),
    "utf-8"
  );
  moviesData = JSON.parse(rawData);
  console.log(`✅ Loaded ${moviesData.length} movies from movies_metadata.json`);
} catch (err) {
  console.error("❌ Failed to load movies_metadata.json:", err.message);
}

// A test route to make sure the server is up.
app.get("/api/ping", (request, response) => {
  console.log("❇️ Received GET request to /api/ping");
  response.send("pong!");
});

// List all movies: returns id, title, tagline, vote_average
app.get("/api/movies", (request, response) => {
  console.log("❇️ Received GET request to /api/movies");
  try {
    const movies = moviesData.map(({ id, title, tagline, vote_average }) => ({
      id,
      title,
      tagline,
      vote_average,
    }));
    response.json({ data: movies });
  } catch (err) {
    console.error("❌ Error fetching movies list:", err.message);
    response.status(500).json({ error: "Internal server error" });
  }
});

// Get a single movie by ID: returns all fields
app.get("/api/movies/:id", (request, response) => {
  const id = parseInt(request.params.id, 10);
  console.log(`❇️ Received GET request to /api/movies/${id}`);
  try {
    if (isNaN(id)) {
      return response.status(400).json({ error: "Invalid movie ID" });
    }
    const movie = moviesData.find((m) => m.id === id);
    if (!movie) {
      return response.status(404).json({ error: `Movie with ID ${id} not found` });
    }
    response.json({ data: movie });
  } catch (err) {
    console.error("❌ Error fetching movie detail:", err.message);
    response.status(500).json({ error: "Internal server error" });
  }
});

// Express port-switching logic
let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});
