import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

/* ────────────────────────────────────────────
   SVG Icon Helpers (no external dep needed)
──────────────────────────────────────────── */
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const FilmIcon = () => (
  <svg className="app-logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="32" height="32" rx="10" fill="url(#logo-grad)"/>
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
        <stop offset="0%" stopColor="hsl(261,80%,65%)"/>
        <stop offset="100%" stopColor="hsl(322,75%,60%)"/>
      </linearGradient>
    </defs>
    <path d="M8 10h2v2H8v-2zM14 10h2v2h-2v-2zM20 10h2v2h-2v-2z" fill="white" fillOpacity="0.6"/>
    <path d="M8 20h2v2H8v-2zM14 20h2v2h-2v-2zM20 20h2v2h-2v-2z" fill="white" fillOpacity="0.6"/>
    <rect x="7" y="8" width="18" height="16" rx="2" stroke="white" strokeWidth="1.5" strokeOpacity="0.9"/>
    <path d="M12 13.5l5 2.5-5 2.5V13.5z" fill="white"/>
  </svg>
);

/* ────────────────────────────────────────────
   Utility: Format release_date to locale string
──────────────────────────────────────────── */
function formatReleaseDate(dateStr) {
  if (!dateStr) return 'N/A';
  // Raw format from JSON: D/M/YY or D/M/YYYY
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  let [day, month, year] = parts.map(Number);
  // Fix 2-digit years (e.g. 95 => 1995)
  if (year < 100) year += year >= 0 && year <= 30 ? 2000 : 1900;
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/* ────────────────────────────────────────────
   Component: Loading
──────────────────────────────────────────── */
function Loading({ text = 'Loading…' }) {
  return (
    <div className="loading-state" role="status" aria-label={text}>
      <div className="spinner" aria-hidden="true" />
      <p className="loading-text">{text}</p>
    </div>
  );
}

/* ────────────────────────────────────────────
   Component: ErrorDisplay
──────────────────────────────────────────── */
function ErrorDisplay({ message }) {
  return (
    <div className="error-state" role="alert">
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <h3>Something went wrong</h3>
      <p>{message}</p>
    </div>
  );
}

/* ────────────────────────────────────────────
   Component: RatingBar
──────────────────────────────────────────── */
function RatingBadge({ vote_average }) {
  const rating = typeof vote_average === 'number' ? vote_average : 0;
  const pct = (rating / 10) * 100;
  return (
    <div>
      <div className="card-rating">
        <span className="card-rating-star" aria-hidden="true"><StarIcon /></span>
        <span className="card-rating-value">{rating.toFixed(1)}</span>
        <span className="card-rating-max">/ 10</span>
      </div>
      <div className="rating-bar-wrap" aria-label={`Rating: ${rating.toFixed(1)} out of 10`}>
        <div className="rating-bar" role="progressbar" aria-valuenow={rating} aria-valuemin={0} aria-valuemax={10}>
          <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Component: MovieCard
──────────────────────────────────────────── */
function MovieCard({ movie, index, onClick }) {
  const { title, tagline, vote_average } = movie;
  return (
    <article
      className="movie-card"
      onClick={() => onClick(movie.id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(movie.id)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${title}`}
      style={{ animationDelay: `${Math.min(index * 0.03, 0.3)}s` }}
    >
      <span className="card-number" aria-hidden="true">#{String(index + 1).padStart(2, '0')}</span>
      <RatingBadge vote_average={vote_average} />
      <h2 className="card-title">{title}</h2>
      {tagline ? (
        <p className="card-tagline">"{tagline}"</p>
      ) : (
        <p className="card-tagline" style={{ opacity: 0.4 }}>No tagline</p>
      )}
      <div className="card-arrow" aria-hidden="true">
        View details <ArrowRightIcon />
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────
   Component: MovieDetail
──────────────────────────────────────────── */
function MovieDetail({ movieId, onBack }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setMovie(null);

    async function fetchMovie() {
      try {
        const res = await fetch(`/api/movies/${movieId}`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${res.status}`);
        }
        const payload = await res.json();
        if (!cancelled) setMovie(payload.data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMovie();
    return () => { cancelled = true; };
  }, [movieId]);

  if (loading) return (
    <div className="detail-page">
      <Loading text="Loading movie details…" />
    </div>
  );

  if (error) return (
    <div className="detail-page">
      <div className="detail-content">
        <button className="back-btn" onClick={onBack} id="detail-back-btn-error">
          <ArrowLeftIcon /> Back to movies
        </button>
        <ErrorDisplay message={error} />
      </div>
    </div>
  );

  if (!movie) return null;

  const {
    title,
    original_title,
    tagline,
    overview,
    release_date,
    runtime,
    status,
    vote_average,
    vote_count,
  } = movie;

  const ratingPct = ((vote_average || 0) / 10) * 100;

  const metaItems = [
    { label: 'Release Date', value: formatReleaseDate(release_date) },
    { label: 'Runtime',      value: runtime ? `${runtime} minutes` : 'N/A' },
    { label: 'Status',       value: status || 'N/A' },
    { label: 'Rating',       value: vote_average != null ? `${vote_average.toFixed(1)} / 10` : 'N/A', accent: true },
    { label: 'Vote Count',   value: vote_count != null ? vote_count.toLocaleString() : 'N/A' },
  ];

  return (
    <div className="detail-page animate-in">
      {/* ── Hero ── */}
      <section className="detail-hero">
        <div className="detail-hero-inner">
          <button
            className="back-btn"
            onClick={onBack}
            id="detail-back-btn"
            aria-label="Back to movies list"
          >
            <ArrowLeftIcon /> Back to movies
          </button>

          {status && (
            <div className="detail-status-badge" aria-label={`Status: ${status}`}>
              <span aria-hidden="true">●</span> {status}
            </div>
          )}

          <h1 className="detail-title">{title}</h1>

          {original_title && original_title !== title && (
            <p className="detail-original-title">Original title: {original_title}</p>
          )}

          {tagline && <p className="detail-tagline">"{tagline}"</p>}

          <div className="detail-rating-row">
            <div className="detail-rating-badge" aria-label={`Rating: ${(vote_average || 0).toFixed(1)} out of 10`}>
              <span className="detail-rating-star" aria-hidden="true"><StarIcon /></span>
              <span className="detail-rating-value">{(vote_average || 0).toFixed(1)}</span>
              <span className="detail-rating-max">/ 10</span>
            </div>
            {vote_count != null && (
              <span className="detail-vote-count">
                {vote_count.toLocaleString()} votes
              </span>
            )}
          </div>

          <div className="rating-bar-wrap" aria-hidden="true" style={{ maxWidth: 300, marginTop: 10 }}>
            <div className="rating-bar">
              <div className="rating-bar-fill" style={{ width: `${ratingPct}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="detail-content">

        {/* Overview */}
        {overview && (
          <div className="detail-overview">
            <p className="detail-section-label">Overview</p>
            <p className="detail-overview-text">{overview}</p>
          </div>
        )}

        {/* Metadata grid */}
        <p className="detail-section-label" style={{ marginBottom: 12 }}>Movie Details</p>
        <div className="detail-meta-grid">
          {metaItems.map(({ label, value, accent }) => (
            <div className="meta-card" key={label}>
              <span className="meta-label">{label}</span>
              <span className={`meta-value${accent ? ' accent' : ''}`}>{value}</span>
            </div>
          ))}
        </div>

        <button
          className="back-btn"
          onClick={onBack}
          id="detail-back-btn-bottom"
          aria-label="Back to movies list"
        >
          <ArrowLeftIcon /> Back to movies
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Component: MovieList
──────────────────────────────────────────── */
function MovieList({ onSelectMovie }) {
  const [movies, setMovies]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch('/api/movies');
        if (!res.ok) throw new Error(`Server error: HTTP ${res.status}`);
        const payload = await res.json();
        setMovies(payload.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  const filtered = movies.filter(m => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (m.title || '').toLowerCase().includes(q) ||
      (m.tagline || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="app">
      {/* ── Sticky Header ── */}
      <header className="app-header" id="main-header">
        <div className="app-header-inner">
          <div className="app-logo" aria-label="CineScope Movie Browser">
            <FilmIcon />
            <span>Cine<span className="logo-accent">Scope</span></span>
          </div>
          <div className="search-wrapper" role="search" aria-label="Search movies">
            <div className="search-bar">
              <span className="search-icon" aria-hidden="true"><SearchIcon /></span>
              <input
                id="movie-search"
                className="search-input"
                type="search"
                placeholder="Search movies or taglines…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search movies"
              />
            </div>
          </div>
          {!loading && !error && (
            <span className="header-count" aria-live="polite">
              {filtered.length} of {movies.length} films
            </span>
          )}
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="hero-banner">
        <h1 className="hero-title">
          <span className="hero-title-main">Discover</span>
          <span className="hero-title-accent">Great Cinema</span>
        </h1>
        <p className="hero-subtitle">
          Browse our curated collection of films and dive into the details of each story.
        </p>
      </section>

      {/* ── Movies Grid ── */}
      <main className="movies-container" id="movies-list">
        {loading && <Loading text="Fetching movies…" />}
        {error && <ErrorDisplay message={error} />}

        {!loading && !error && (
          <>
            <div className="section-header">
              <p className="section-title">
                {search.trim()
                  ? <><strong>{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''} for "{search}"</>
                  : <><strong>{movies.length}</strong> movies in the collection</>
                }
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="no-results" aria-live="polite">
                <div className="no-results-icon" aria-hidden="true">🎬</div>
                <h3>No movies found</h3>
                <p>Try a different search term.</p>
              </div>
            ) : (
              <div className="movies-grid" id="movies-grid" role="list" aria-label="Movies">
                {filtered.map((movie, index) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    index={index}
                    onClick={onSelectMovie}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ────────────────────────────────────────────
   Root App
──────────────────────────────────────────── */
function App() {
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const handleSelectMovie = useCallback((id) => {
    setSelectedMovieId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedMovieId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (selectedMovieId !== null) {
    return (
      <div className="app">
        <header className="app-header" id="main-header-detail">
          <div className="app-header-inner">
            <div className="app-logo" aria-label="CineScope Movie Browser">
              <FilmIcon />
              <span>Cine<span className="logo-accent">Scope</span></span>
            </div>
          </div>
        </header>
        <main id="movie-detail">
          <MovieDetail movieId={selectedMovieId} onBack={handleBack} />
        </main>
      </div>
    );
  }

  return <MovieList onSelectMovie={handleSelectMovie} />;
}

export default App;
