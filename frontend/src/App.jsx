import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage"; // Keep or remove?
import TeamsPage from "./pages/TeamsPage";
import PlayersPage from "./pages/PlayersPage";
import DrillsPage from "./pages/DrillsPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/players" element={<PlayersPage />} /> {/* Ruta para PlayersPage */}
        <Route path="/drills" element={<DrillsPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
      </Routes>
    </Router>
  );
}

export default App;


