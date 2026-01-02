import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti";
import FilmContainerCast from "./FilmContainerCast";
import Flag from "../../components/Flag";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { listISO2 } from "../../utils/countryCodes";

const NO_POSTER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='230' height='345'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='sans-serif' font-size='14'>No poster</text></svg>";

export default function FilmContainer({ movie, onSeeMore }) {
  const title = movie?.name ?? "—";
  const year = movie?.date ?? "—";
  const posterUrl = movie?.poster?.link ?? NO_POSTER;
  const minutes = isFiniteNumber(movie?.minute) ? movie.minute : null;
  const runtime = minutes ? formatMinutes(minutes) : "—";

  // rating (0–5)
  const rating = isFiniteNumber(movie?.rating) ? clamp(movie.rating, 0, 5) : null;

  const tagline = movie?.tagline || "";
  const description = movie?.description || "";

  const genres = (movie?.genres ?? [])
    .map((g) => g?.genre)
    .filter(Boolean)
    .slice(0, 3);

  const castAll = Array.isArray(movie?.cast) ? movie.cast : [];
  const sortedCast = [...castAll].sort((a, b) => {
    const ai = a?.imageUrl || a?.imagePath ? 1 : 0;
    const bi = b?.imageUrl || b?.imagePath ? 1 : 0;
    return bi - ai;
  });
  const cast = sortedCast.slice(0, 6);
  const hasMoreCast = castAll.length > 6;

  // flags (countries)
  const countryNamesFromMovie = (movie?.countries ?? []).map((c) => c?.country).filter(Boolean);
  const countryNamesFromReleases = (movie?.releases ?? [])
    .map((r) => r?.country?.country)
    .filter(Boolean);
  const rawCountryNames =
    countryNamesFromMovie.length > 0 ? countryNamesFromMovie : countryNamesFromReleases;
  const safeCountryCodes = listISO2(rawCountryNames, 2);

  return (
    <>
      <div className="glass-card film-container ">
        <div className="film-container-countries">
          {safeCountryCodes.map((code) => (
            <span className="flag-chip" key={code}>
              <Flag code={code.toLowerCase()} />
            </span>
          ))}
        </div>

        <div className="img-placeholder poster-elevated">
          <img
            src={posterUrl}
            alt={title !== "—" ? `${title} poster` : "Poster non disponibile"}
            onError={(e) => {
              e.currentTarget.src = NO_POSTER;
            }}
            loading="eager"
          />
        </div>

        <div className="film-container-infos">
          <h1 className="gradient-text">
            {title} <label>{year}</label>
          </h1>

          <div className="film-container-infos-stars">
            <Stars value={rating} />
            <label>{/* {movie?.reviewsCount ?? "—"} */}</label>
          </div>

          <div className="film-container-infos-duration">
            {runtime}
            {genres.length > 0 && (
              <span className="film-container-genres"> • {genres.join(", ")}</span>
            )}
          </div>

          <div className="film-container-infos-description">
            {tagline && <h2>{tagline}</h2>}
            {description ? <p>{description}</p> : <p>Descrizione non disponibile.</p>}
          </div>

          <div className="film-container-infos-cast-wrapper">
            <h3>Cast:</h3>
            <div className="film-container-infos-cast">
              {cast.length ? (
                <>
                  {cast.map((c) => (
                    <FilmContainerCast
                      key={c.id ?? `${c.actorId}-${c.actorName}`}
                      castName={c.actorName ?? "—"}
                      imageUrl={c.imageUrl ?? null}  
                      actorId={c.actorId ?? null}    
                    />
                  ))}
                  {hasMoreCast && (
                    <span
                      className="film-container-cast-more glass-dot"
                      aria-label={`+${castAll.length - 6} altri`}
                      title={`+${castAll.length - 6} altri`}
                    >
                      …
                    </span>
                  )}
                </>
              ) : (
                <span>Non disponibile</span>
              )}
            </div>
          </div>

          <div className="film-container-infos-seemore">
            <button
              type="button"
              className="film-container-seemore-btn glass-pill"
              onClick={onSeeMore}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? onSeeMore?.() : null)}
            >
              <span className="btn-icon">
                <IoIosArrowDropdownCircle />
              </span>
              See more
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function isFiniteNumber(n) {
  return typeof n === "number" && Number.isFinite(n);
}
function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}
function formatMinutes(m) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h}h ${min}m`;
}
function Stars({ value }) {
  if (!isFiniteNumber(value)) {
    return (
      <span aria-label="rating non disponibile" className="stars">
        {[...Array(5)].map((_, i) => (
          <TiStarOutline key={i} />
        ))}
      </span>
    );
  }
  const rounded = Math.round(value * 2) / 2;
  const full = Math.floor(rounded);
  const half = rounded % 1 === 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <span aria-label={`valutazione ${rounded} su 5`} className="stars">
      {Array.from({ length: full }, (_, i) => (
        <TiStarFullOutline key={`f${i}`} />
      ))}
      {half === 1 && <TiStarHalfOutline key="half" />}
      {Array.from({ length: empty }, (_, i) => (
        <TiStarOutline key={`e${i}`} />
      ))}
    </span>
  );
}
