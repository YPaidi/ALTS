// src/Register.js
import React, { useState } from "react";

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Panggil fungsi onRegister yang didefinisikan di App
    onRegister(formData);
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <br/>

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
        <br/>

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
        <br/>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
