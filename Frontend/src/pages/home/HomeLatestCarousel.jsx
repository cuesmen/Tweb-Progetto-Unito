import { useRef } from "react";
import { useLatestMovies } from "../../api/movie/useTopLatestMovies";
import Alert from "../../components/Alert";
import HomeCarouselCard from "./HomeCarouselCard";
import HomeCarouselSkeleton from "./HomeCarouselSkeleton";

export default function HomeLatestCarousel({ limit = 12, anchorId = "latest" }) {
  const { data: movies = [], isLoading, isError, error } = useLatestMovies(limit, true);
  const trackRef = useRef(null);

  const scrollByCards = (dir = 1) => {
    const viewport = trackRef.current?.parentElement;
    if (!viewport) return;
    const step = Math.round(viewport.clientWidth * 0.85);
    viewport.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="home-carousel" id={anchorId} aria-label="Novità">
      <header className="carousel-header">
        <h3>✨ Prossime uscite</h3>
        <div className="carousel-cta">
          <button className="nav-btn" onClick={() => scrollByCards(-1)} aria-label="Scorri indietro">
            ‹
          </button>
          <button className="nav-btn" onClick={() => scrollByCards(1)} aria-label="Scorri avanti">
            ›
          </button>
        </div>
      </header>

      {isError ? (
        <Alert
          type="warning"
          title="Lista non disponibile"
          description={error?.message || "Impossibile caricare le Novità."}
        />
      ) : isLoading ? (
        <HomeCarouselSkeleton />
      ) : (
        <div className="carousel-viewport">
          <ul className="carousel-track" ref={trackRef}>
            {movies.map((m) => (
              <li key={m.id} className="carousel-card">
                <HomeCarouselCard movie={m} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
