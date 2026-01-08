import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useActorInfoQuery } from "../../api/actor/useActorInfoQuery";
import DefaultPage from "../../components/DefaultPage";

import {
  FiStar,
  FiUser,
  FiCalendar,
  FiXCircle,
  FiHome,
  FiImage,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import OscarAwards from "../../components/OscarAwards";

function formatDate(d) {
  if (!d) return null;
  try {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return d;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return d;
  }
}

function InitialsCircle({ name, size = 240 }) {
  const initials =
    (name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "A";

  return (
    <div
      className="actor-img-fallback glass-card poster-elevated"
      style={{ width: size, height: Math.round(size * 1.5) }}
      aria-label={`${name || "Actor"} — no image`}
      role="img"
    >
      <span>{initials}</span>
    </div>
  );
}

function StatChip({ label, value, Icon }) {
  if (!value) return null;
  return (
    <div className="chip glass-chip" title={`${label}: ${value}`}>
      {Icon ? <Icon className="chip-icon" aria-hidden /> : null}
      <span className="chip-label">{label}</span>
      <span className="chip-value">{value}</span>
    </div>
  );
}

function EmptyState({ actorId, message }) {
  const navigate = useNavigate();
  const [gotoId, setGotoId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const n = Number(gotoId);
    if (Number.isFinite(n) && n > 0) navigate(`/actor/${n}`);
  };

  return (
    <div className="empty-state glass-card">
      <div className="empty-visual" role="img" aria-label="No actor info">
        <FiAlertCircle size={56} />
      </div>
      <h2 className="empty-title gradient-text">No actor details</h2>
      <p className="empty-message">
        {message || `Couldn't find any info for actor with ID ${actorId}.`}
      </p>

      <form className="empty-form" onSubmit={handleSubmit}>
        <input
          id="gotoId"
          inputMode="numeric"
          pattern="[0-9]*"
          className="empty-input"
          placeholder="Enter an actor ID"
          value={gotoId}
          onChange={(e) => setGotoId(e.target.value.replace(/[^\d]/g, ""))}
        />
        <button type="submit" className="glass-pill actor-btn">
          Go <FiArrowRight aria-hidden />
        </button>
      </form>

      <div className="empty-actions">
        <Link to="/" className="glass-pill actor-btn">
          <FiHome aria-hidden /> Home
        </Link>
      </div>
    </div>
  );
}

export default function ActorPage() {
  const { id } = useParams();
  const actorId = Number(id);
  const { data: info, isLoading, isError, error } = useActorInfoQuery(actorId);

  const errorMsg =
    error?.response?.data?.error?.message ||
    error?.message ||
    "Actor info not found";

  if (isLoading) {
    return <DefaultPage loading loadingMessage="Loading actor…" />;
  }

  if (isError || !info) {
    return (
      <DefaultPage>
        <div className="actor-container glass-card">
          <EmptyState actorId={actorId} message={errorMsg} />
        </div>
      </DefaultPage>
    );
  }

  return (
    <DefaultPage>
      <div className="actor-page">
        <div className="actor-container glass-card">
          <div className="actor-poster img-placeholder poster-elevated" aria-live="polite">
            {info?.imageUrl ? (
              <img
                src={info.imageUrl}
                alt={info?.name ? `${info.name} portrait` : `Actor #${info.actorId}`}
                loading="eager"
                width="240"
                height="360"
              />
            ) : (
              <InitialsCircle name={info?.name || `Actor #${info?.actorId || actorId}`} />
            )}
          </div>

          <section className="actor-infos">
            <div className="actor-header">
              <h1 className="actor-name gradient-text">
                {info?.name || `Actor #${info?.actorId}`}
                {info?.actorId ? (
                  <label className="actor-id-chip">ID {info.actorId}</label>
                ) : null}
              </h1>

              <div className="actor-meta">
                <StatChip
                  label="Popularity"
                  value={info?.popularity != null ? Math.round(info.popularity) : null}
                  Icon={FiStar}
                />
                <StatChip label="Gender" value={info?.genderText ?? null} Icon={FiUser} />
                <StatChip
                  label="Born"
                  value={[
                    formatDate(info?.birthday),
                    info?.placeOfBirth ? `· ${info.placeOfBirth}` : null,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  Icon={FiCalendar}
                />
                {info?.deathday ? (
                  <StatChip label="Death" value={formatDate(info.deathday)} Icon={FiXCircle} />
                ) : null}
              </div>
            </div>

            <div className="actor-bio">
              <h2>Biography</h2>
              <p className="bio-text">
                {info?.biography ? info.biography : "Biography not available."}
              </p>
            </div>

            <div className="actor-actions">
              <Link to="/" className="glass-pill actor-btn">
                <FiHome aria-hidden /> Home
              </Link>
              {info?.imageUrl && (
                <a
                  className="glass-pill actor-btn"
                  href={info.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiImage aria-hidden /> Open image
                </a>
              )}
            </div>
          </section>
        </div>
      </div>
      <div className="actor-oscars">
        <OscarAwards actorId={actorId} showFilm={true} />
      </div>
    </DefaultPage>
  );
}
