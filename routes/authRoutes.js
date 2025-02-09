// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

const StudentData = require("../models/StudentData");

// Endpoint: POST /api/register
router.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi." });
    }

    // 2. Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan user baru ke MongoDB
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // 5. Kembalikan response sukses
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error on register:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cek input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2. Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Bandingkan password (plain) dengan hashed password di DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Password salah
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4. Jika benar, login sukses
    //    Di sini Anda bisa kembalikan token JWT, atau sekadar message
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error on login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/save", async (req, res) => {
  try {
    const { name, studentId, courses } = req.body;
    if (!name || !studentId || !courses) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Simpan ke Mongo
    const newData = new StudentData({ name, studentId, courses });
    await newData.save();

    return res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
Lalu di server.js:

js
Copy
Edit
const dataRoutes = require("./routes/dataRoutes");
app.use(dataRoutes);
Tentu, Anda juga butuh file model:

js
Copy
Edit
// models/StudentData.js
const mongoose = require("mongoose");

const StudentDataSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  courses: [
    {
      courseName: String,
      assessmentType: String,
      hours: Number,
      week: Number,
    },
  ],
});


module.exports = router;
module.exports = mongoose.model("StudentData", StudentDataSchema);
