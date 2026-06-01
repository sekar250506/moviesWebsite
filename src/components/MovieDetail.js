import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetail.css";

function Field({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="field-row">
      <span className="field-label">{label}</span>
      <span className="field-value">{value}</span>
    </div>
  );
}

function parseReleaseDate(raw) {
  if (!raw) return null;
  // Data format is DD/MM/YY, e.g. "30/10/95"
  const parts = raw.split("/");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const fullYear = parseInt(y) <= 30 ? `20${y}` : `19${y}`;
    const date = new Date(`${fullYear}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`);
    if (!isNaN(date)) {
      return date.toLocaleDateString(undefined, {
        year: "numeric", month: "long", day: "numeric",
      });
    }
  }
  // Fallback: try native Date parse
  const d = new Date(raw);
  if (!isNaN(d)) return d.toLocaleDateString(undefined, { year:"numeric", month:"long", day:"numeric" });
  return raw;
}

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/movies/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => { setMovie(data); setLoading(false); })
      .catch(() => { setError("Movie not found."); setLoading(false); });
  }, [id]);

  const releaseDate = movie ? parseReleaseDate(movie.release_date) : null;
  const runtime = movie?.runtime
    ? `${movie.runtime} minutes`
    : null;

  return (
    <div className="detail-page">
      <div className="detail-nav">
        <button className="back-btn" onClick={() => navigate("/")}>
          <span className="back-arrow">←</span> All Films
        </button>
      </div>

      {loading && (
        <div className="state-center">
          <div className="loader" />
          <p>Loading…</p>
        </div>
      )}
      {error && <div className="state-center error">{error}</div>}

      {movie && (
        <article className="detail-article">
          {/* Header */}
          <header className="detail-header">
            <div className="detail-header-rule" />
            <h1 className="detail-title">{movie.title}</h1>
            {movie.original_title && movie.original_title !== movie.title && (
              <p className="detail-original-title">Original: {movie.original_title}</p>
            )}
            {movie.tagline && (
              <p className="detail-tagline">"{movie.tagline}"</p>
            )}
            <div className="detail-score-row">
              <div className="detail-score-circle">
                <span className="detail-score-num">{movie.vote_average.toFixed(1)}</span>
                <span className="detail-score-max">/10</span>
              </div>
              {movie.vote_count && (
                <span className="detail-vote-count">
                  {movie.vote_count.toLocaleString()} votes
                </span>
              )}
            </div>
            <div className="detail-header-rule detail-header-rule--bottom" />
          </header>

          {/* Overview */}
          {movie.overview && (
            <section className="detail-overview-section">
              <p className="detail-overview">{movie.overview}</p>
            </section>
          )}

          {/* Details grid */}
          <section className="detail-fields">
            <h2 className="detail-fields-heading">Film Details</h2>
            <div className="fields-list">
              <Field label="Release Date"    value={releaseDate} />
              <Field label="Runtime"         value={runtime} />
              <Field label="Status"          value={movie.status} />
              <Field label="Original Title"  value={movie.original_title !== movie.title ? movie.original_title : null} />
              <Field label="Vote Average"    value={`${movie.vote_average.toFixed(1)} / 10`} />
              <Field label="Vote Count"      value={movie.vote_count?.toLocaleString()} />
            </div>
          </section>
        </article>
      )}
    </div>
  );
}
