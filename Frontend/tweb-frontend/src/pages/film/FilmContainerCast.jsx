import { FaUser } from "react-icons/fa";

export default function FilmContainerCast({ castName }){
  return (
    <div className="tooltip film-container-cast" data-tooltip={castName} >
      <span >
        <FaUser aria-hidden="true" />
      </span>
    </div>
  );
}
