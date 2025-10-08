import React, { useEffect, useState } from "react";
import "../css/navbar.css";
import logo from '../assets/images/logo.png'
import InputField from "../components/InputField";

import { FiSearch } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <div className="upperNav">
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
          <img onClick={() => navigate("/")} className="logo" src={logo} />
          <InputField
            iconRight={<FiSearch />}
           inputProps={{ placeholder: "Cerca un film, attore, studio o paese" }}
          />
          <div className="nav-welcome">
            Benvenuto Guest! <a>Login/Registrati</a>
          </div>
        </nav>

        <div className={`nav-links ${scrolled ? "scrolled" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : undefined)}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/film"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Film
          </NavLink>
        </div>
      </div>

      <div
        className="nav-spacer"
        style={{ height: scrolled ? 55 : 85 }}
      />
    </>
  );
}
