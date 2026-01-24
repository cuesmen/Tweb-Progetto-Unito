import { useState, useMemo } from "react";
import { FiAward, FiChevronDown, FiFilm, FiLoader, FiUser, FiXCircle } from "react-icons/fi";
import { useOscarAwardQuery } from "../api/oscaraward/useOscarAwardQuery";
import "../css/oscarawards.css";

export default function OscarAwards({ actorId, movieId, title = "Oscar Awards", showFilm = true }) {
  const [open, setOpen] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data, isLoading, isFetching, isError } = useOscarAwardQuery({
    actorId: shouldFetch ? actorId : undefined,
    movieId: shouldFetch ? movieId : undefined,
    enabled: !!(actorId || movieId),
  });

  const awards = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => safeDate(b.yearFilm || b.yearCeremony) - safeDate(a.yearFilm || a.yearCeremony));
  }, [data]);

  const subtitle = useMemo(() => {
    if (!shouldFetch) return "Click to load";
    if (isLoading || isFetching) return "Loading awards…";
    if (isError) return "No awards found";
    if (!awards.length) return "No awards";
    return `${awards.length} award${awards.length === 1 ? "" : "s"}`;
  }, [awards.length, isError, isFetching, isLoading, shouldFetch]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (!shouldFetch) setShouldFetch(true);
  };

  return (
    <section className="oscar-section glass-card">
      <button
        type="button"
        className={`oscar-toggle ${open ? "is-open" : ""}`}
        onClick={handleToggle}
        aria-expanded={open}
        aria-controls="oscar-dropdown"
      >
        <div className="oscar-toggle__main">
          <span className="oscar-toggle__icon">
            <FiAward />
          </span>
          <div className="oscar-toggle__text">
            <span className="oscar-toggle__title">{title}</span>
            <small className="oscar-toggle__subtitle">{subtitle}</small>
          </div>
        </div>
        <span className="oscar-toggle__chevron" aria-hidden>
          <FiChevronDown />
        </span>
      </button>

      <div
        id="oscar-dropdown"
        className={`oscar-dropdown ${open ? "is-open" : ""}`}
        role="region"
      >
        {!shouldFetch ? (
          <div className="oscar-empty">
            <FiAward aria-hidden />
            <span>Tap to fetch Oscar awards</span>
          </div>
        ) : isLoading || isFetching ? (
          <div className="oscar-empty">
            <FiLoader className="spin" aria-hidden />
            <span>Loading…</span>
          </div>
        ) : isError ? (
          <div className="oscar-empty is-error">
            <FiXCircle aria-hidden />
            <span>Error while loading</span>
          </div>
        ) : awards.length === 0 ? (
          <div className="oscar-empty">
            <FiAward aria-hidden />
            <span>No awards available.</span>
          </div>
        ) : (
          <ul className="oscar-list">
            {awards.map((award) => (
              <li key={award.id} className="oscar-card">
                <header className="oscar-card__head">
                  <div className="oscar-pill">
                    <FiAward />
                    {award.winner ? "Winner" : "Nominee"}
                  </div>
                  <span className="oscar-year">
                    {award.yearFilm || "—"} · {award.yearCeremony || "—"}
                  </span>
                </header>
                <div className="oscar-card__body">
                  <h4 className="oscar-category">
                    {award.category ? award.category.charAt(0).toUpperCase() + award.category.slice(1).toLowerCase() : "—"}
                  </h4>
                  <p className="oscar-name">
                    <FiUser aria-hidden /> {award.name || "—"}
                  </p>
                  {showFilm ? (
                    <p className="oscar-film">
                      <FiFilm aria-hidden /> {award.film || "—"}
                    </p>
                  ) : null}
                  <div className={`oscar-winner ${award.winner ? "is-winner" : "is-nominee"}`}>
                    {award.winner ? "Winner" : "Nominee"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function safeDate(value) {
  const d = new Date(value);
  const ts = d.getTime();
  return Number.isNaN(ts) ? 0 : ts;
}
