const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Membolehkan parsing JSON

// Simpan data pelajar (dalam memori untuk sekarang)
const students = {}; // Contoh struktur: { id: { id, name, courses: [...] } }

// Simpan maklumat pelajar baru
app.post("/api/students", (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) {
    return res.status(400).json({ error: "ID and Name are required" });
  }
  if (students[id]) {
    return res.status(400).json({ error: "Student with this ID already exists" });
  }
  students[id] = { id, name, courses: [] };
  res.status(200).json({ message: "Student saved successfully", student: students[id] });
});

// Simpan maklumat kursus pelajar
app.post("/api/courses", (req, res) => {
  const { studentId, courseName, assessments } = req.body;
  if (!students[studentId]) {
    return res.status(404).json({ error: "Student not found" });
  }
  if (!courseName || !Array.isArray(assessments)) {
    return res.status(400).json({ error: "Course name and assessments are required" });
  }
  students[studentId].courses.push({ courseName, assessments });
  res.status(200).json({ message: "Course added successfully", student: students[studentId] });
});

// Ambil maklumat pelajar berdasarkan ID
app.get("/api/students/:id", (req, res) => {
  const studentId = req.params.id;
  if (!students[studentId]) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.status(200).json(students[studentId]);
});

// Ambil semua pelajar
app.get("/api/students", (req, res) => {
  res.status(200).json({ message: "All students retrieved successfully", students });
});

// Kemas kini maklumat pelajar
app.put("/api/students/:id", (req, res) => {
  const studentId = req.params.id;
  const { name } = req.body;
  if (!students[studentId]) {
    return res.status(404).json({ error: "Student not found" });
  }
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  students[studentId].name = name;
  res.status(200).json({ message: "Student updated successfully", student: students[studentId] });
});

// Padamkan pelajar
app.delete("/api/students/:id", (req, res) => {
  const studentId = req.params.id;
  if (!students[studentId]) {
    return res.status(404).json({ error: "Student not found" });
  }
  delete students[studentId];
  res.status(200).json({ message: "Student deleted successfully" });
});

// Jalankan server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
