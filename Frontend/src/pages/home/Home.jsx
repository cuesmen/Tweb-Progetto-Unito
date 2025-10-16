import { useMemo, useState } from "react";
import DefaultPage from "../../components/DefaultPage";
import { IoSparkles, IoPlayCircle, IoShuffle } from "react-icons/io5";
import { TiStarFullOutline } from "react-icons/ti";

/** Fallback poster */
const NO_POSTER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='230' height='345'><rect width='100%' height='100%' fill='%23151515'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='sans-serif' font-size='14'>No poster</text></svg>";

const MOCK_MOVIES = [
  { id: 1, title: "The Odyssey of Light", year: 2024, rating: 4.5, poster: NO_POSTER },
  { id: 2, title: "Neon Harbor", year: 2023, rating: 4.0, poster: NO_POSTER },
  { id: 3, title: "Paper Planets", year: 2022, rating: 3.5, poster: NO_POSTER },
  { id: 4, title: "Velvet Comet", year: 2021, rating: 4.8, poster: NO_POSTER },
  { id: 5, title: "Silent Echo", year: 2019, rating: 4.1, poster: NO_POSTER },
  { id: 6, title: "Glass Horizon", year: 2020, rating: 3.9, poster: NO_POSTER },
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("Tutti");
  const [featured, setFeatured] = useState(MOCK_MOVIES[0]);

  const filtered = useMemo(() => {
    if (activeFilter === "Top Rated") {
      return [...MOCK_MOVIES].sort((a, b) => b.rating - a.rating);
    }
    if (activeFilter === "Novità") {
      return [...MOCK_MOVIES].sort((a, b) => (b.year || 0) - (a.year || 0));
    }
    return MOCK_MOVIES;
  }, [activeFilter]);

  const shuffleFeatured = () => {
    const pick = filtered[Math.floor(Math.random() * filtered.length)];
    setFeatured(pick);
  };

  return (
    <DefaultPage loadingMessage="Loading home…">
      <div className="home glass-scene">
        <div className="home-blur-blob blob-a" />
        <div className="home-blur-blob blob-b" />
        <div className="home-noise" />

        <section className="home-hero glass-card">
          <div className="hero-copy">
            <h1 className="gradient-text">
              MoviePoint
              <small> cinema, raffinato.</small>
            </h1>
            <p className="hero-sub">
              Scopri, colleziona e ama i tuoi film preferiti con un’esperienza
              <span className="spark"> ultra-fluida</span>.
            </p>

            <div className="cta-row">
              <button
                className={`glass-pill ${activeFilter === "Tutti" ? "is-active" : ""}`}
                onClick={() => setActiveFilter("Tutti")}
                aria-pressed={activeFilter === "Tutti"}
              >
                Tutti
              </button>
              <button
                className={`glass-pill ${activeFilter === "Top Rated" ? "is-active" : ""}`}
                onClick={() => setActiveFilter("Top Rated")}
                aria-pressed={activeFilter === "Top Rated"}
              >
                Top Rated
              </button>
              <button
                className={`glass-pill ${activeFilter === "Novità" ? "is-active" : ""}`}
                onClick={() => setActiveFilter("Novità")}
                aria-pressed={activeFilter === "Novità"}
              >
                <IoSparkles /> Novità
              </button>

              <button className="glass-cta" onClick={shuffleFeatured} aria-label="Film casuale">
                <IoShuffle /> Shuffle
              </button>
            </div>
          </div>

          <article className="featured-card glass-inset">
            <div className="featured-media">
              <img
                src={featured?.poster || NO_POSTER}
                alt={featured?.title ? `${featured.title} poster` : "Poster"}
                onError={(e) => { e.currentTarget.src = NO_POSTER; }}
              />
              <button className="play-fab" aria-label="Guarda trailer">
                <IoPlayCircle />
              </button>
            </div>
            <div className="featured-info">
              <h2>{featured?.title ?? "—"}</h2>
              <div className="meta">
                <span className="year-badge">{featured?.year ?? "—"}</span>
                <span className="rating">
                  <TiStarFullOutline /> {featured?.rating?.toFixed(1) ?? "—"}
                </span>
              </div>
              <p className="tagline">Una visione cristal-clear in stile glass.</p>
            </div>
          </article>
        </section>

        <section className="home-grid">
          {filtered.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </section>
      </div>
    </DefaultPage>
  );
}

function MovieCard({ movie }) {
  return (
    <article className="movie-card glass-card">
      <div className="movie-media">
        <img
          src={movie.poster || NO_POSTER}
          alt={`${movie.title} poster`}
          onError={(e) => { e.currentTarget.src = NO_POSTER; }}
          loading="lazy"
        />
      </div>
      <div className="movie-info">
        <h3 title={movie.title}>{movie.title}</h3>
        <div className="movie-meta">
          <span className="badge">{movie.year}</span>
          <span className="rating">
            <TiStarFullOutline />
            {movie.rating}
          </span>
        </div>
      </div>
    </article>
  );
}
