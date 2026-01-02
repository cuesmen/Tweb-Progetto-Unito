import { useState, useEffect } from "react";
import DefaultPage from "../../components/DefaultPage";
import Alert from "../../components/Alert";
import { useRandomMovie } from "../../api/movie/useRandomMovie";
import HomeFilmFounded from "./HomeFilmFounded";
import HomeTopSearch from "./HomeTopSearch";
import HomeTopRatedCarousel from "./HomeTopRatedCarousel";
import HomeLatestCarousel from "./HomeLatestCarousel";

const NO_POSTER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='230' height='345'><rect width='100%' height='100%' fill='%23151515'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='sans-serif' font-size='14'>No poster</text></svg>";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("Top Rated");
  const [featured, setFeatured] = useState(null);
  const [showError, setShowError] = useState(true);
  const [imgLoading, setImgLoading] = useState(false);

  const { data, isError, error, isLoading, isFetching, refetch } = useRandomMovie(false);

  useEffect(() => {
    if (data) setFeatured(data);
  }, [data]);

  useEffect(() => {
    if (!featured) {
      handleShuffle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!featured) return;
    const hasPoster = Boolean(featured?.poster?.link);
    setImgLoading(hasPoster);
  }, [featured]);

  async function handleShuffle() {
    setImgLoading(true);
    try {
      const res = await refetch?.();
      const next = res?.data;
      if (next) {
        setFeatured(next);
      } else {
        setFeatured({
          id: -1,
          name: "—",
          date: "—",
          description: "",
          rating: null,
          poster: { link: NO_POSTER },
        });
        setImgLoading(false);
      }
    } catch (err) {
      console.error(err);
      setFeatured({
        id: -1,
        name: "—",
        date: "—",
        description: "",
        rating: null,
        poster: { link: NO_POSTER },
      });
      setImgLoading(false);
    }
  }

  const showNotFound = !isLoading && !isError && !featured;

  return (
    <DefaultPage
      loading={isLoading}
      loadingMessage="Loading home…"
      minShowMs={500}
      delayMs={0}
    >
      {isError && showError ? (
        <Alert
          type="error"
          title="Errore durante il caricamento"
          description={error?.message || "Si è verificato un errore inatteso."}
          dismissible
          onClose={() => setShowError(false)}
        />
      ) : showNotFound ? (
        <Alert
          type="warning"
          title="Nessun film disponibile"
          description="Non siamo riusciti a trovare un film in evidenza al momento."
        />
      ) : (
        <div className="home glass-scene">
          <div className="home-blur-blob blob-a" />
          <div className="home-blur-blob blob-b" />
          <div className="home-noise" />

          <section className="home-hero glass-card">
            <HomeTopSearch
              activeFilter={activeFilter}
              onChangeFilter={setActiveFilter}
              onShuffle={handleShuffle}
              isFetching={!!isFetching}
            />

            {featured && (
              <HomeFilmFounded
                featured={featured}
                imgLoading={imgLoading}
                isFetching={!!isFetching}
                onImgLoad={() => setImgLoading(false)}
                onImgError={() => setImgLoading(false)}
              />
            )}
          </section>

          {/* Caroselli */}
          <section className="home-carousels">
            <HomeTopRatedCarousel limit={12} anchorId="top-rated" />
            <HomeLatestCarousel limit={12} anchorId="latest" />
          </section>
        </div>
      )}
    </DefaultPage>
  );
}
