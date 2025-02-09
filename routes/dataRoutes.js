// routes/dataRoutes.js
const express = require("express");
const router = express.Router();
const StudentData = require("../models/StudentData"); // Misal schema

// POST /api/save
router.post("/api/save", async (req, res) => {
  try {
    const { name, email, studentId, assessments } = req.body;
    if (!email || !assessments) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Terserah apakah Anda mau update data if exist, atau bikin baru
    // Contoh: hapus data lama, masukkan data baru
    await StudentData.deleteMany({ email }); // Sederhana
    const newData = new StudentData({
      name,
      email,
      studentId,
      assessments,
    });
    await newData.save();

    return res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/delete?email=...
router.delete("/api/delete", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required in query" });
    }

    // Hapus semua data milik email tsb
    await StudentData.deleteMany({ email });

    return res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// routes/dataRoutes.js
router.get("/api/data", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required in query" });
    }

    // Cari data di DB berdasarkan email
    const existingData = await StudentData.findOne({ email });
    if (!existingData) {
      return res.status(404).json({ message: "No data found for this email" });
    }

    // Kembalikan data
    return res.status(200).json(existingData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
