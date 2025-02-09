// src/Homepage.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div style={{ margin: "20px" }}>
      <h1>Assessment Load Tracker for Students</h1>
      <p>
        Selamat datang ke aplikasi Assessment Load Tracker for Students. Di sini,
        pelajar boleh mendaftar, log masuk, dan mengemaskini maklumat penilaian kursus.
        Sila gunakan butang di bawah untuk meneruskan.
      </p>
      <div>
        <button onClick={() => navigate("/login")}>Go to Login Page</button>
        <button onClick={() => navigate("/data")} style={{ marginLeft: "10px" }}>
          Go to Data Page
        </button>
      </div>
      <p style={{ marginTop: "20px" }}>
        (Anda boleh menambah maklumat tambahan di sini mengenai cara penggunaan aplikasi
        atau apa-apa maklumat lain yang relevan.)
      </p>
    </div>
  );
}
