# CineScope — Movie Browser

A fullstack web application that displays a list of movies and movie details, built with **React** and **Express**.

## Features

- **Movie List Page** — Responsive grid (4 columns desktop → 1 column mobile) displaying movie cards with title, tagline, and rating out of 10
- **Movie Detail Page** — Full movie information with localized release date, runtime in minutes, rating, vote count, overview, and status
- **Live Search** — Real-time filtering by movie title or tagline
- **Premium Dark-Mode UI** — Gradient hero banner, card hover animations, Outfit/Inter typography
- **Back Navigation** — Return to list from any detail page

## Tech Stack

- **Frontend**: React 16, CSS3 (custom properties, CSS Grid, animations)
- **Backend**: Node.js, Express
- **Data**: 100 movies loaded from `server/movies_metadata.json`
- **Dev Tools**: Concurrently, http-proxy-middleware, cross-env

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)

### Installation

```bash
npm install
```

### Running in Development

```bash
# On Node v17+, you may need the OpenSSL legacy provider:
set NODE_OPTIONS=--openssl-legacy-provider   # Windows CMD
# or
export NODE_OPTIONS=--openssl-legacy-provider # macOS/Linux

npm start
```

This starts both the React dev server (port 3000) and the Express API server (port 3001) concurrently. The React app proxies `/api` requests to Express.

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running in Production

```bash
npm run production
```

This builds the React app and serves it via Express on port 3000.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/movies` | Returns all movies (id, title, tagline, vote_average) |
| `GET` | `/api/movies/:id` | Returns full details for a single movie |
| `GET` | `/api/ping` | Health check endpoint |

## Project Structure

```
├── server/
│   ├── server.js                # Express API server
│   └── movies_metadata.json     # Movie data (100 films)
├── src/
│   ├── App.js                   # React app (MovieList, MovieDetail, Search)
│   ├── App.css                  # Component styles, responsive grid, animations
│   ├── index.js                 # React entry point
│   ├── index.css                # Design system (colors, typography, reset)
│   └── setupProxy.js            # Dev proxy configuration
├── public/                      # Static assets
├── package.json
└── README.md
```

## Responsive Design

The movie grid adapts to screen size:

| Viewport | Columns |
|----------|---------|
| Desktop (>1200px) | 4 columns |
| Tablet (769–1200px) | 3 columns |
| Mobile landscape (481–768px) | 2 columns |
| Mobile portrait (≤480px) | 1 column |

## If Given More Time

- Add pagination or infinite scroll for larger datasets
- Implement sorting (by rating, release date, title)
- Add movie poster images via an external API (e.g., TMDB)
- Write unit tests for API endpoints and React components
- Add React Router for proper URL-based navigation
- Implement server-side search/filtering with query parameters

## License

MIT
