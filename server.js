// server.js
require("dotenv").config(); // Memuat variabel environment dari file .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dataRoutes = require("./routes/dataRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ambil connection string dari environment variable
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in the environment!");
  process.exit(1); // Keluar jika variabel tidak diset
}

// Koneksikan ke MongoDB Atlas (pastikan MONGODB_URI adalah connection string Atlas)
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB error:", err));

// Gunakan routes
app.use(dataRoutes);

// Tentukan port dari environment atau fallback ke 3001 (hanya untuk development)
const port = process.env.PORT || 3001;

const path = require("path");

// Sajikan fail statik dari folder build
app.use(express.static(path.join(__dirname, "build")));

// Untuk sebarang route yang tidak ditangani oleh API, hantar index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
