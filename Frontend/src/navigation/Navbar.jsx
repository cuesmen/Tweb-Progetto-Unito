import React, { useEffect, useState, useRef } from "react";
import "../css/navbar.css";
import logo from "../assets/images/logo.png";
import { FiSearch, FiUser, FiFilm, FiAlertCircle } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useSearchQuery } from "../api/search/useSearchQuery";

/** Debounce hook to avoid excessive API calls */
function useDebouncedValue(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Single search result item */
function SearchResult({ result, onClick }) {
  return (
    <div className="search-item" onClick={onClick}>
      {result.imageUrl && (
        <img
          src={result.imageUrl}
          alt={result.title}
          className="search-thumb"
        />
      )}
      <span className="search-title">{result.title}</span>
      <span className="search-type">
        {result.type === "actor" ? <FiUser /> : <FiFilm />}
      </span>
    </div>
  );
}

function SearchErrorState({ message }) {
  return (
    <div className="search-item empty error">
      <FiAlertCircle
        style={{ opacity: 0.8, marginRight: 8, color: "var(--main-color)" }}
      />
      <span>{message || "An unexpected error occurred."}</span>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebouncedValue(query, 500);

  // Query search results
  const {
    data: results = [],
    isLoading,
    isError,
    error,
  } = useSearchQuery(debouncedQuery);

  const errorMsg =
    error?.response?.data?.error?.message ||
    error?.message ||
    "Unable to complete search.";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="upperNav">
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
          <img onClick={() => navigate("/")} className="logo" src={logo} alt="Logo" />

          <div className="search-container" ref={searchRef}>
            <input
              type="text"
              placeholder="Search for a movie or actor..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <FiSearch className="search-icon" />

            {query.length >= 2 && (
              <div className="search-dropdown">
                {isLoading && <div className="search-item">Loading...</div>}
                {isError && <SearchErrorState message={errorMsg} />}
                {!isError && !isLoading && results.length === 0 && (
                  <div className="search-item empty">
                    <FiSearch style={{ opacity: 0.5, marginRight: 8 }} />
                    No results found
                  </div>
                )}
                {!isLoading &&
                  !isError &&
                  results.map((r) => (
                    <SearchResult
                      key={`${r.type}-${r.id}`}
                      result={r}
                      onClick={() => {
                        navigate(`/${r.type === "actor" ? "actor" : "film"}/${r.id}`);
                        setQuery("");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="nav-welcome">
            Welcome Guest! <a>Login / Register</a>
          </div>
        </nav>

        <div className={`nav-links ${scrolled ? "scrolled" : ""}`}>
          <NavLink to="/" end>Home</NavLink>
        </div>
      </div>

      <div className="nav-spacer" style={{ height: scrolled ? 55 : 85 }} />
    </>
  );
}
