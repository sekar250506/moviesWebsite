/**
 * listMovies.js
 * Utility helpers for querying movies_metadata.json
 */
const path = require("path");
const movies = require(path.join(__dirname, "movies_metadata.json"));

/** Returns summary list: id, title, tagline, vote_average */
function listMovies() {
  return movies.map(({ id, title, tagline, vote_average }) => ({
    id,
    title,
    tagline,
    vote_average,
  }));
}

/** Returns full movie object by id, or null */
function getMovieById(id) {
  return movies.find((m) => String(m.id) === String(id)) || null;
}

module.exports = { listMovies, getMovieById };
