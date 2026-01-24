import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../views/home/Home";
import NavBar from "../views/navbar/Navbar";
import Movie from "../views/movie/Movie";
import ActorPage from "../views/actor/ActorPage";
import Footer from "../views/footer/Footer";
import BackToTopArrow from "../components/BackToTopArrow";
import GlobalChat from "../views/globalchat/GlobalChat";

export default function AppRoutes() {
  return (
    <Router>
      <div className="app-shell">
        <NavBar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<Movie />} />
            <Route path="/actor/:id" element={<ActorPage />} />
            <Route path="/global-chat" element={<GlobalChat />} />
          </Routes>
        </main>
        <BackToTopArrow />
        <Footer />
      </div>
    </Router>
  );
}
