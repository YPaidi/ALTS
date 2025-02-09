// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./Homepage";
import DataPage from "./DataPage";

// Komponen Layout: Ada header, footer, dan di tengah {children}
function Layout({ children }) {
  return (
    <div style={{ margin: "20px" }}>
      <header style={{ background: "#f0f0f0", padding: "10px" }}>
        <h2>Assessment Load Tracker for Students</h2>
      </header>

      <main style={{ minHeight: "70vh", marginTop: "20px" }}>
        {children}
      </main>

      <footer style={{ marginTop: "20px", background: "#f0f0f0", padding: "10px" }}>
        Developed by Rohayati Paidi
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Root route akan memaparkan Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Halaman Data */}
        <Route path="/data" element={<DataPage />} />
      </Routes>
    </Router>
  );
}
