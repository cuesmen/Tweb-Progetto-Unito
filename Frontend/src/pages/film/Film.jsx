import { useParams } from "react-router-dom";
import { useState } from "react";
import { scroller } from "react-scroll";

import DefaultPage from "../../components/DefaultPage";
import FilmContainer from "./FilmContainer";
import FilmInfos from "./FilmInfos";
import FilmCrewCarousel from "./FilmCrewCarousel";
import Alert from "../../components/Alert";
import { useMovieQuery } from "../../api/movie/useMovieQuery";

export default function Film() {
  const { id } = useParams();
  const movieId = Number(id);

  const { data: movie, isError, error, isLoading } = useMovieQuery(movieId);
  const [showError, setShowError] = useState(true);

  const handleSeeMore = () => {
    scroller.scrollTo("film-infos", {
      duration: 1500,
      delay: 0,
      smooth: "easeInOut",
      offset: -130,
    });
  };

  if (isLoading) {
    return (
      <DefaultPage loading={isLoading} loadingMessage="Loading movie...">
      </DefaultPage>
    );
  }

  if (isError && showError) {
    return (
      <DefaultPage>
        <Alert
          type="error"
          title="Error when loading the movie"
          description={error?.message || "An unexpected error has occurred."}
          dismissible
          onClose={() => setShowError(false)}
        />
      </DefaultPage>
    );
  }

  if (!isError && !movie) {
    return (
      <DefaultPage>
        <Alert
          type="warning"
          title="Film not found"
          description="The requested movie is not available or does not exist."
          />
      </DefaultPage>
    );
  }

  return (
    <DefaultPage>
      <div className="film-page">
        <FilmContainer movie={movie} onSeeMore={handleSeeMore} />
        <FilmInfos movie={movie} />
        <FilmCrewCarousel movie={movie} isActor />
        <FilmCrewCarousel movie={movie} />
      </div>
    </DefaultPage>
  );
}
