import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../logo.svg";
import "./MovieList.css";

function ScoreBar({ value }) {
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${(value / 10) * 100}%` }} />
      </div>
      <span className="score-num">{value.toFixed(1)}</span>
    </div>
  );
}

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/movies")
      .then((r) => {
        if (!r.ok) throw new Error("Server error");
        return r.json();
      })
      .then((data) => { setMovies(data); setLoading(false); })
      .catch(() => { setError("Could not load movies."); setLoading(false); });
  }, []);

  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="list-page">
      {/* Masthead */}
      <header className="masthead">
        <div className="masthead-top-rule" />
        <div className="masthead-inner">
          <img src={logo} className="masthead-logo" alt="Répertoire logo" />
          <p className="masthead-eyebrow">A CURATED COLLECTION</p>
          <h1 className="masthead-title">RÉPERTOIRE</h1>
          <p className="masthead-subtitle">100 Essential Films</p>
        </div>
        <div className="masthead-bottom-rule" />
        <div className="search-bar-wrap">
          <input
            className="search-bar"
            type="text"
            placeholder="Search titles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search movies"
          />
        </div>
      </header>

      <main className="list-main">
        {loading && (
          <div className="state-center">
            <div className="loader" />
            <p>Loading collection…</p>
          </div>
        )}
        {error && <div className="state-center error">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="state-center">No titles match "{search}"</div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="movies-grid">
            {filtered.map((movie, i) => (
              <article
                key={movie.id}
                className="movie-card"
                style={{ animationDelay: `${Math.min(i, 20) * 40}ms` }}
                onClick={() => navigate(`/movies/${movie.id}`)}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/movies/${movie.id}`)}
                role="button"
                aria-label={`View ${movie.title}`}
              >
                <div className="card-index">{String(i + 1).padStart(2, "0")}</div>
                <h2 className="card-title">{movie.title}</h2>
                {movie.tagline ? (
                  <p className="card-tagline">{movie.tagline}</p>
                ) : (
                  <p className="card-tagline card-tagline--empty">&nbsp;</p>
                )}
                <ScoreBar value={movie.vote_average} />
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="list-footer">
        <div className="footer-rule" />
        <p>{filtered.length} of {movies.length} titles</p>
      </footer>
    </div>
  );
}
