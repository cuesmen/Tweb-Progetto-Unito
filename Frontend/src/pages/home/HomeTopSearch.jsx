import { IoSparkles, IoShuffle } from "react-icons/io5";

export default function HomeTopSearch({ activeFilter, onChangeFilter, onShuffle, isFetching }) {
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
            className={`glass-pill ${activeFilter === "Top Rated" ? "is-active" : ""}`}
            onClick={() => onChangeFilter("Top Rated")}
            aria-pressed={activeFilter === "Top Rated"}
          >
            Top Rated
          </button>
          <button
            className={`glass-pill ${activeFilter === "Novità" ? "is-active" : ""}`}
            onClick={() => onChangeFilter("Novità")}
            aria-pressed={activeFilter === "Novità"}
          >
            <IoSparkles /> Prossime uscite
          </button>
  
          <button
            className="glass-cta"
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