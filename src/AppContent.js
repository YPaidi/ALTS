import React from "react";
import { Link } from "react-router-dom";

const AppContent = () => (
  <div>
    <h1>Welcome to the Tracker App</h1>
    <nav>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </nav>
    {/* Your existing app content */}
  </div>
);

export default AppContent;
