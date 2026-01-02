// src/AppRoutes.jsx (o nel tuo entry point principale)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Home from "../pages/home/Home";
import NavBar from "./Navbar";
import Film from "../pages/film/Film";
import ActorPage from "../pages/actor/ActorPage";
import Footer from "./Footer";
import BackToTopArrow from "../components/BackToTopArrow";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,    
      gcTime: 5 * 60 * 1000,   //cache
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app-shell">
          <NavBar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/film/:id" element={<Film />} />
              <Route path="/actor/:id" element={<ActorPage />} />
            </Routes>
          </main>
          <BackToTopArrow />
          <Footer />
        </div>
      </Router>

      {/*<ReactQueryDevtools initialIsOpen={false} />*/}
    </QueryClientProvider>
  );
}
