// src/DataPage.js
import React, { useState } from "react";

export default function DataPage() {
  // Step management: 1 = input identitas, 2 = input course & summary
  const [step, setStep] = useState(1);

  // State untuk identitas
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");

  // State untuk input course
  const [courseCode, setCourseCode] = useState("");
  const [assessmentType, setAssessmentType] = useState("");
  const [hours, setHours] = useState("");
  const [week, setWeek] = useState("");

  // Daftar penilaian
  const [assessments, setAssessments] = useState([]);

  // ==================================
  // STEP 1: Input identitas & cek data
  // ==================================
  const handleNext = async (e) => {
    e.preventDefault();
    if (!name || !email || !studentId) {
      alert("Please fill in Name, Email, and Student ID.");
      return;
    }

    // Coba ambil data lama dari server
    try {
      const response = await fetch(
        `http://localhost:3001/api/data?email=${email}`
      );
      if (response.ok) {
        // Status 200 => data lama ditemukan
        const existingData = await response.json();
        // existingData = { name, email, studentId, assessments, ... }
        // Set state agar user tidak perlu isi ulang
        setName(existingData.name);
        setEmail(existingData.email);
        setStudentId(existingData.studentId);
        setAssessments(existingData.assessments || []);
        alert("Existing data found. Loaded from database.");
        setStep(2);
      } else if (response.status === 404) {
        // Tidak ada data => user baru
        alert("No existing data found. Proceed with new input.");
        setStep(2);
      } else {
        // Error lain (500, dsb.)
        const errorText = await response.text();
        console.error("Fetch data error:", errorText);
        alert("Error fetching existing data. Proceed with new input.");
        setStep(2);
      }
    } catch (err) {
      console.error("Network error fetching data:", err);
      alert("Network error. Proceed with new input.");
      setStep(2);
    }
  };

  // ==================================
  // STEP 2: Tambah data penilaian
  // ==================================
  const handleAddAssessment = (e) => {
    e.preventDefault();
    if (!courseCode || !assessmentType || !hours || !week) {
      alert("Please fill in all fields.");
      return;
    }

    setAssessments((prev) => [
      ...prev,
      {
        courseCode,
        assessmentType,
        hours: parseInt(hours, 10),
        week: parseInt(week, 10),
      },
    ]);

    // Reset form
    setCourseCode("");
    setAssessmentType("");
    setHours("");
    setWeek("");
  };

  // Group data by Course Code
  const groupedByCode = assessments.reduce((acc, item) => {
    const code = item.courseCode;
    if (!acc[code]) {
      acc[code] = [];
    }
    acc[code].push(item);
    return acc;
  }, {});

  // Summary by Week
  const summaryByWeek = assessments.reduce((acc, item) => {
    const w = item.week;
    if (!acc[w]) {
      acc[w] = 0;
    }
    acc[w] += item.hours;
    return acc;
  }, {});

  // Logout => reset state & kembali step 1
  const handleLogout = () => {
    setName("");
    setEmail("");
    setStudentId("");
    setAssessments([]);
    setStep(1);
  };

  // ==================================
  // FUNGSI SAVE => POST /api/save
  // ==================================
  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          studentId,
          assessments,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Save error:", errorText);
        throw new Error("Failed to save data");
      }
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data. Please try again.");
    }
  };

  // ==================================
  // FUNGSI DELETE => DELETE /api/delete?email=...
  // ==================================
  const handleDelete = async () => {
    if (!email) {
      alert("No email to identify user data.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/api/delete?email=${email}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete error:", errorText);
        throw new Error("Failed to delete data");
      }
      alert("Data deleted successfully!");
      // Bersihkan state assessment
      setAssessments([]);
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Failed to delete data. Please try again.");
    }
  };

  // ==================================
  // RENDER
  // ==================================
  return (
    <div style={{ margin: "20px" }}>
      {/* STEP 1: Input Identitas */}
      {step === 1 && (
        <div>
          <h1>Step 1: Student Info</h1>
          <form onSubmit={handleNext}>
            <label>
              Name:{" "}
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <br />
            <label>
              Email:{" "}
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <br />
            <label>
              Student ID:{" "}
              <input
                type="text"
                placeholder="Your student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Next</button>
          </form>
        </div>
      )}

      {/* STEP 2: Input Course + Summary */}
      {step === 2 && (
        <div>
          <h1>Step 2: Course & Assessment</h1>
          <p>
            Welcome, {name} ({studentId}) - {email}
          </p>
          <button onClick={handleLogout} style={{ float: "right" }}>
            Logout
          </button>

          <h3>Add Assessment</h3>
          <form onSubmit={handleAddAssessment}>
            <label>
              Course Code:{" "}
              <input
                type="text"
                placeholder="ABC123"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              />
            </label>
            <br />
            <label>
              Assessment Type:{" "}
              <input
                type="text"
                placeholder="Assignment, Quiz..."
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value)}
              />
            </label>
            <br />
            <label>
              Hours (including prep):{" "}
              <input
                type="number"
                placeholder="2"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </label>
            <br />
            <label>
              Week:{" "}
              <input
                type="number"
                placeholder="1"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Add Assessment</button>
          </form>

          <hr />

          {/* GROUP BY COURSE CODE */}
          <h3>Current Assessments (Group by Course Code)</h3>
          {Object.keys(groupedByCode).length === 0 ? (
            <p>No data yet.</p>
          ) : (
            Object.keys(groupedByCode).map((code) => (
              <div key={code} style={{ marginBottom: "1em" }}>
                <h4>Course Code: {code}</h4>
                <ul>
                  {groupedByCode[code].map((item, idx) => (
                    <li key={idx}>
                      {item.assessmentType}, {item.hours} hours, Week{" "}
                      {item.week}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}

          <hr />

          {/* SUMMARY BY WEEK */}
          <h3>Summary by Week</h3>
          {Object.keys(summaryByWeek).length === 0 ? (
            <p>No data yet.</p>
          ) : (
            <ul>
              {Object.keys(summaryByWeek).map((w) => (
                <li key={w}>
                  Week {w}: {summaryByWeek[w]} hours total
                </li>
              ))}
            </ul>
          )}

          <hr />

          {/* Tombol Save & Delete */}
          <div style={{ marginTop: "20px" }}>
            <button onClick={handleSave}>Save Data</button>
            <button onClick={handleDelete} style={{ marginLeft: 8 }}>
              Delete Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
