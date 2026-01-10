import { IoPlayCircle } from "react-icons/io5";
import { TiStarFullOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

export default function HomeFilmFounded({ featured, imgLoading, isFetching, onImgLoad, onImgError }) {

  const navigate = useNavigate();

    const NO_POSTER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='230' height='345'><rect width='100%' height='100%' fill='%23151515'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='sans-serif' font-size='14'>No poster</text></svg>";


    return (
      <article className="featured-card glass-inset">
        {(isFetching || imgLoading) && (
          <div className="featured-loading-overlay" aria-live="polite" aria-busy="true">
            <div className="spinner" />
            <span className="sr-only">Loading...</span>
          </div>
        )}
  
        <div 
        className={`featured-media ${imgLoading ? "is-loading" : ""}`}
        onClick={() => navigate(`/film/${featured?.id}`)}>
          {imgLoading && <div className="img-skeleton" aria-hidden="true" />}
  
          <img
            src={featured?.poster?.link || NO_POSTER}
            alt={featured?.name ? `${featured.name} poster` : "Poster"}
            onLoad={onImgLoad}
            onError={(e) => {
              e.currentTarget.src = NO_POSTER;
              onImgError?.();
            }}
            style={imgLoading ? { opacity: 0 } : { opacity: 1, transition: "opacity 200ms ease" }}
          />
  
          <button className="play-fab" aria-label="See trailer">
            <IoPlayCircle />
          </button>
        </div>
  
        <div className="featured-info" aria-busy={isFetching || imgLoading}>
          <h2>{featured?.name ?? "—"}</h2>
          <div className="meta">
            <span className="year-badge">{featured?.date ?? "—"}</span>
            <span className="rating">
              <TiStarFullOutline />{" "}
              {featured?.rating != null ? Number(featured.rating).toFixed(1) : "—"}
            </span>
          </div>
          <p className="tagline">{featured?.description || "—"}</p>
        </div>
      </article>
    );
  }