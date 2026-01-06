import { IoSparkles, IoShuffle } from "react-icons/io5";

export default function HomeTopSearch({ onShuffle, isFetching }) {
    return (
      <div className="hero-copy">
        <h1 className="gradient-text">
          MoviePoint
          <small> cinema.</small>
        </h1>
        <p className="hero-sub">
          Find your next favorite movie with MoviePoint! Explore our vast collection, read reviews, and get personalized recommendations. Dive into the world of cinema today!
        </p>
  
        <div className="cta-row">
          <button
            className={`glass-pill "is-active" : ""}`}
            onClick={onShuffle}
            aria-label="Film casuale"
            disabled={isFetching}
          >
            <IoShuffle />
            {isFetching ? "Carico…" : "Shuffle"}
          </button>
        </div>
      </div>
    );
  }