import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function FilmCrewCarousel({ movie, isActor = false }) {
  const normalized = useMemo(() => {
    if (!movie) return [];
    if (isActor) {
      const base = (movie.cast ?? [])
        .map((c) => ({
          id: c?.actorId ?? null,
          name: c?.actorName ?? "—",
          role: c?.role ?? "",
          imageUrl: c?.imageUrl ?? null,
          imagePath: c?.imagePath ?? null,
        }))
        .filter((p) => p.name && p.name !== "—");

      return base.sort((a, b) => {
        const ai = a.imageUrl ? 1 : 0;
        const bi = b.imageUrl ? 1 : 0;
        return bi - ai; 
      });
    } else {
      return (movie.crew ?? [])
        .map((m) => ({
          id: null,
          name: m?.personName ?? "—",
          role: m?.roleName ?? "",
          imageUrl: null,
        }))
        .filter((p) => p.name && p.name !== "—");
    }
  }, [movie, isActor]);

  const [people, setPeople] = useState(normalized);
  useEffect(() => { setPeople(normalized); }, [normalized]);

  const [isAnimating, setIsAnimating] = useState(false);
  const trackRef = useRef(null);

  const CARD_WIDTH = 150 + 20;

  const handleScroll = (dir) => {
    if (isAnimating || people.length <= 1) return;
    const track = trackRef.current;
    if (!track) return;

    setIsAnimating(true);
    track.style.transition = "transform 0.45s ease";
    track.style.transform = `translateX(${dir * -CARD_WIDTH}px)`;

    setTimeout(() => {
      track.style.transition = "none";
      track.style.transform = "translateX(0)";

      setPeople((prev) => {
        if (prev.length <= 1) return prev;
        const arr = [...prev];
        if (dir > 0) {
          const first = arr.shift();
          if (first) arr.push(first);
        } else {
          const last = arr.pop();
          if (last) arr.unshift(last);
        }
        return arr;
      });

      setIsAnimating(false);
    }, 450);
  };

  const title = isActor ? "Actors" : "Film Crew";

  return (
    <section className={`film-crew-carousel ${isActor ? "actors" : "crew"}`}>
      <h2>{title}</h2>

      <div className="carousel-wrapper">
        <button
          className="carousel-arrow left"
          onClick={() => handleScroll(-1)}
          disabled={isAnimating || people.length <= 1}
          aria-label="Scroll left"
          title="Scroll left"
        >
          <IoChevronBack />
        </button>

        <div className="film-crew-viewport">
          {people.length === 0 ? (
            <div className="crew-empty">No items available.</div>
          ) : (
            <div className="film-crew-track" ref={trackRef}>
              {people.map((member, i) => {
                const key = member.id != null ? `${member.id}-${i}` : `${member.name}-${i}`;

                const CardInner = (
                  <>
                    <div className="crew-avatar">
                      {isActor && member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={`${member.name} portrait`}
                          className="crew-photo"
                          loading="lazy"
                        />
                      ) : (
                        <FaUser className="crew-icon" aria-hidden />
                      )}
                    </div>
                    <div className="crew-name" title={member.name}>
                      {member.name}
                    </div>
                    {member.role ? (
                      <div className="crew-role" title={member.role}>
                        {member.role}
                      </div>
                    ) : (
                      <div className="crew-role crew-role--empty">—</div>
                    )}
                  </>
                );

                const clickable = isActor && member.id != null && !!member.imageUrl;

                return clickable ? (
                  <Link
                    to={`/actor/${member.id}`}
                    key={key}
                    className="crew-card glass crew-card--clickable"
                    aria-label={`Open actor ${member.name}`}
                  >
                    {CardInner}
                  </Link>
                ) : (
                  <div key={key} className="crew-card glass crew-card--disabled" aria-disabled="true">
                    {CardInner}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          className="carousel-arrow right"
          onClick={() => handleScroll(1)}
          disabled={isAnimating || people.length <= 1}
          aria-label="Scroll right"
          title="Scroll right"
        >
          <IoChevronForward />
        </button>
      </div>
    </section>
  );
}
