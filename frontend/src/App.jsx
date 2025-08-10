import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TeamsPage from "./pages/TeamsPage";
import PlayersPage from "./pages/PlayersPage";  // Importa PlayersPage

function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Inicio</Link>
        <Link to="/teams" style={{ marginRight: "1rem" }}>Equipos</Link>
        <Link to="/players">Jugadores</Link> {/* Añade el enlace a Jugadores */}
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/players" element={<PlayersPage />} /> {/* Ruta para PlayersPage */}
      </Routes>
    </Router>
  );
}

export default App;
