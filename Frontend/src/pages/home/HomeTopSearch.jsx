import { IoSparkles, IoShuffle } from "react-icons/io5";

export default function HomeTopSearch({ activeFilter, onShuffle, isFetching }) {
    return (
      <div className="hero-copy">
        <h1 className="gradient-text">
          MoviePoint
          <small> cinema.</small>
        </h1>
        <p className="hero-sub">
          Scopri e colleziona i tuoi film preferiti o trovane di nuovi!
        </p>
  
        <div className="cta-row">
          <button
            className={`glass-pill ${activeFilter === "Novità" ? "is-active" : ""}`}
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