import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../pages/home/Home";
import NavBar from "./Navbar";
import Film from "../pages/film/Film";
import ActorPage from "../pages/actor/ActorPage";
import Footer from "./Footer";
import BackToTopArrow from "../components/BackToTopArrow";
import GlobalChat from "../pages/globalchat/GlobalChat";

export default function AppRoutes() {
  return (
    <Router>
      <div className="app-shell">
        <NavBar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/film/:id" element={<Film />} />
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
