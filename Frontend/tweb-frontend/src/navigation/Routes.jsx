import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import NavBar from "./Navbar";
import Film from "../pages/film/Film";

export default function AppRoutes() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/film" element={<Film />} />
      </Routes>
    </Router>
  );
}
