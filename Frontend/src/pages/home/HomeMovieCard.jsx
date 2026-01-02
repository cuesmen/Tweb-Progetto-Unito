import { TiStarFullOutline } from "react-icons/ti";

export default function MovieCard({ movie }) {

    const NO_POSTER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='230' height='345'><rect width='100%' height='100%' fill='%23151515'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='sans-serif' font-size='14'>No poster</text></svg>";

    return (
      <article className="movie-card glass-card">
        <div className="movie-media">
          <img
            src={movie.poster || NO_POSTER}
            alt={`${movie.title} poster`}
            onError={(e) => {
              e.currentTarget.src = NO_POSTER;
            }}
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