// src/Login.js
import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Panggil props onLogin (yang akan kita definisikan di App.js)
    onLogin(formData);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </label>
        <br />
        <label>
          Password:
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
