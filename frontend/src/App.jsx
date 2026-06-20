import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import SeatSelection from './pages/SeatSelection';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
          <main className="flex-grow-1 mt-5">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route path="/booking/:id" element={<SeatSelection />} />
              
              {/* Catch-all redirect */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
