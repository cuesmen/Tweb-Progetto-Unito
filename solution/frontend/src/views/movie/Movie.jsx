import { useParams } from "react-router-dom";
import { useState } from "react";
import { scroller } from "react-scroll";

import DefaultPage from "../../views/components/DefaultPage";
import MovieContainer from "./MovieContainer";
import MovieInfos from "./MovieInfos";
import MovieCrewCarousel from "./MovieCrewCarousel";
import MovieChat from "./MovieChat";
import Alert from "../../views/components/Alert";
import { useMovieQuery } from "../../api/movie/useMovieQuery";
import MovieReviews from "./MovieReviews";
import OscarAwards from "../../views/components/OscarAwards";

export default function Movie() {
  const { id } = useParams();
  const movieId = Number(id);

  const { data: movie, isError, error, isLoading } = useMovieQuery(movieId);
  // eslint-disable-next-line no-unused-vars
  const [showError, setShowError] = useState(true);

  const handleSeeMore = () => {
    scroller.scrollTo("film-infos", { duration: 1500, delay: 0, smooth: "easeInOut", offset: -130 });
  };

  return (
    <DefaultPage
      loading={isLoading}
      loadingMessage="Loading movie..."
      minShowMs={500}
      delayMs={0}
    >
      {isError && showError ? (
        <Alert
          type="error"
          title="Error when loading the movie"
          description={error?.message || "An unexpected error has occurred."}
          dismissible
        />
      ) : !isError && !isLoading && !movie ? (  
        <Alert
          type="warning"
          title="Film not found"
          description="The requested movie is not available or does not exist."
        />
      ) : movie ? (
        <div className="film-page">
          <MovieContainer movie={movie} onSeeMore={handleSeeMore} />
          <MovieInfos movie={movie} />
          <MovieCrewCarousel movie={movie} isActor />
          <MovieCrewCarousel movie={movie} />
          <MovieReviews movie={movie} />
          <OscarAwards showFilm={false} movieId={movie.id}/>
          <MovieChat movie={movie} />
        </div>
      ) : null}
    </DefaultPage>
  );
}
