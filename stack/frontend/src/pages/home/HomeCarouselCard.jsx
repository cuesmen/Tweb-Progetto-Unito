import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const NO_POSTER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='230' height='345'><rect width='100%' height='100%' fill='%23151515'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='sans-serif' font-size='14'>No poster</text></svg>";

export default function HomeCarouselCard({ movie }) {
  const navigate = useNavigate();
  const movieId = movie?.id ?? null;
  const poster = movie?.poster?.link || NO_POSTER;

  const goToDetails = useCallback(() => {
    if (!movieId) return;
    navigate(`/film/${movieId}`);
  }, [movieId, navigate]);

  const handleKeyDown = (event) => {
    if (!movieId) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToDetails();
    }
  };

  const rating =
    movie?.rating != null ? Number(movie.rating).toFixed(1) : "—";

  return (
    <article
      className={`carousel-item glass-card ${
        movieId ? "carousel-item--clickable" : "carousel-item--disabled"
      }`}
      title={movie?.name || "Movie"}
      role={movieId ? "link" : undefined}
      tabIndex={movieId ? 0 : undefined}
      aria-disabled={movieId ? undefined : "true"}
      onClick={movieId ? goToDetails : undefined}
      onKeyDown={handleKeyDown}
    >
      <div className="carousel-media">
        <img
          src={poster}
          alt={`${movie?.name || "Movie"} poster`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = NO_POSTER;
            e.currentTarget.classList.add("img-error");
          }}
        />
      </div>

      <div className="carousel-info">
        <h4 className="line-clamp-1">{movie?.name || "—"}</h4>
        <div className="carousel-meta">
          <span className="badge">{movie?.date ?? "—"}</span>
          <span className="rating">★ {rating}</span>
        </div>
      </div>
    </article>
  );
}
