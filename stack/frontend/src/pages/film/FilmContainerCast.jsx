import { useState } from "react";
import { FaUser } from "react-icons/fa";

export default function FilmContainerCast({ castName, imageUrl = null }) {
  const [broken, setBroken] = useState(false);
  const showImage = !!imageUrl && !broken;

  return (
    <div
      className="tooltip"
      data-tooltip={castName}
      title={castName}
      aria-label={castName}
      tabIndex={0}               
    >
      <div className="film-container-cast" role="img" aria-label={castName}>
        {showImage ? (
          <img
            className="cast-avatar"
            src={imageUrl}
            alt={`${castName} portrait`}
            loading="lazy"
            onError={() => setBroken(true)}
          />
        ) : (
          <span aria-hidden="true">
            <FaUser />
          </span>
        )}
      </div>
    </div>
  );
}
