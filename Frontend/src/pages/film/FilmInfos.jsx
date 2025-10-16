import { Element } from "react-scroll";

export default function FilmInfos({ movie }) {
  const title = movie?.name ?? "—";
  const description = movie?.description ?? "Descrizione non disponibile.";

  const studios = (movie?.studios ?? []).map((s) => s?.name).filter(Boolean);
  const genres = (movie?.genres ?? []).map((g) => g?.genre).filter(Boolean);
  const countries =
    (movie?.countries ?? []).length > 0
      ? movie.countries.map((c) => c?.country).filter(Boolean)
      : (movie?.releases ?? []).map((r) => r?.country?.country).filter(Boolean);
  const languages = (movie?.languages ?? []).map((l) => l?.language).filter(Boolean);

  const runtime = isFiniteNumber(movie?.minute) ? formatMinutes(movie.minute) : "—";

  const primaryRelease = getPrimaryRelease(movie?.releases ?? null);
  const primaryReleaseLabel = primaryRelease
    ? `${primaryRelease.releaseDate}${primaryRelease.country ? `, ${primaryRelease.country}` : ""}`
    : "—";

  const themes = (movie?.themes ?? []).map((t) => t?.theme).filter(Boolean);

  return (
    <Element className="film-infos" name="film-infos" id="film-infos">
      <h1>Movie Info</h1>

      <div className="film-infos-frame">
        <h4>{title}</h4>
        <p>{description}</p>

        <hr className="film-separator" />
        <Row title="Studios" value={listOrDash(studios)} />

        <hr className="film-separator" />
        <Row title="Genre" value={listOrDash(genres)} />

        {themes.length > 0 && (
          <>
            <hr className="film-separator" />
            <div className="film-infos-frame-row">
              <ul className="film-themes">
                {themes.map((t, i) => (
                  <li
                    key={`${t}-${i}`}
                    className="theme-chip"
                    style={{ "--hue": (i * 47) % 360 }}
                    title={t}
                  >
                    <span className="theme-dot" />
                    <span className="theme-text">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <hr className="film-separator" />
        <Row title="Countries" value={listOrDash(countries)} />

        <hr className="film-separator" />
        <Row title="Language" value={listOrDash(languages)} />

        <hr className="film-separator" />
        <Row title="Release Date" value={primaryReleaseLabel} />

        <hr className="film-separator" />
        <Row title="Runtime" value={runtime} />

        <hr className="film-separator" />
      </div>
    </Element>
  );
}


function Row({ title, value }) {
  return (
    <div className="film-infos-frame-row">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
}

function listOrDash(arr) {
  return Array.isArray(arr) && arr.length ? arr.join(", ") : "—";
}

function isFiniteNumber(n) {
  return typeof n === "number" && Number.isFinite(n);
}

function formatMinutes(m) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h}h ${min}m`;
}

function getPrimaryRelease(releases) {
  if (!Array.isArray(releases) || releases.length === 0) return null;

  const sortedTheatrical = releases
    .filter((r) => (r?.releaseType || "").toLowerCase() === "theatrical")
    .sort((a, b) => cmpDateAsc(a?.releaseDate, b?.releaseDate));

  const best =
    sortedTheatrical[0] ??
    [...releases].sort((a, b) => cmpDateAsc(a?.releaseDate, b?.releaseDate))[0];

  return best
    ? { releaseDate: best.releaseDate ?? "", country: best.country?.country ?? "" }
    : null;
}

function cmpDateAsc(a, b) {
  const da = a ? Date.parse(a) : Number.POSITIVE_INFINITY;
  const db = b ? Date.parse(b) : Number.POSITIVE_INFINITY;
  return da - db;
}
