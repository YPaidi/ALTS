import React, { useState } from "react";

// =====================================
// STEP 1: StudentInfoForm
// =====================================
function StudentInfoForm({ onNext }) {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !studentId) {
      alert("Please fill in Name and Student ID.");
      return;
    }
    onNext({ name, studentId });
  };

  return (
    <div>
      <h1>Assessment Load Tracker for Students</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </label>
        <br />
        <label>
          Student ID:{" "}
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter your student ID"
          />
        </label>
        <br />
        <button type="submit">Next</button>
      </form>
    </div>
  );
}

// =====================================
// STEP 2: CourseForm + Summary in one page
// =====================================
function CourseAndSummaryPage({ name, studentId, onLogout }) {
  const [courseName, setCourseName] = useState("");
  const [assessmentType, setAssessmentType] = useState("");
  const [hours, setHours] = useState("");
  const [week, setWeek] = useState("");
  const [courses, setCourses] = useState([]);

  // Tambahan: ringkasan By Week bisa dihitung di setiap render
  const summaryByWeek = courses.reduce((acc, c) => {
    const w = c.week;
    if (!acc[w]) acc[w] = 0;
    acc[w] += c.hours;
    return acc;
  }, {});

  // Menangani penambahan kursus
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!courseName || !assessmentType || !hours || !week) {
      alert("Please fill in all fields.");
      return;
    }

    // Tambah ke state
    setCourses((prev) => [
      ...prev,
      {
        courseName,
        assessmentType,
        hours: parseInt(hours, 10),
        week: parseInt(week, 10),
      },
    ]);

    // Reset form
    setCourseName("");
    setAssessmentType("");
    setHours("");
    setWeek("");
  };

  // =========================
  // 2) Fitur Save ke DB
  // =========================
  const handleSave = async () => {
    // Contoh: panggil endpoint /api/save
    // Pastikan Anda membuat route di server, misal:
    // POST /api/save => simpan data { name, studentId, courses } ke DB
    try {
      const response = await fetch("http://localhost:3001/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, studentId, courses }),
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

  // =========================
  // 3) Download + Share PDF
  // =========================
  const handleDownloadPdf = async () => {
    // Kita bisa gunakan library jsPDF
    // npm install jspdf
    // import { jsPDF } from "jspdf";

    // Contoh minimal (tanpa styling):
    const { jsPDF } = await import("jspdf"); // dynamic import
    const doc = new jsPDF();

    doc.text(`Name: ${name}`, 10, 10);
    doc.text(`Student ID: ${studentId}`, 10, 20);

    let yPos = 30;
    courses.forEach((c, i) => {
      doc.text(
        `${i + 1}. ${c.courseName} | ${c.assessmentType} | ${c.hours} hours | Week ${c.week}`,
        10,
        yPos
      );
      yPos += 10;
    });

    // ringkasan by week
    yPos += 10;
    doc.text("Summary By Week:", 10, yPos);
    yPos += 10;
    Object.keys(summaryByWeek).forEach((w) => {
      doc.text(`Week ${w}: ${summaryByWeek[w]} hours`, 10, yPos);
      yPos += 10;
    });

    // download PDF
    doc.save(`assessment_${studentId}.pdf`);
  };

  const handleShareViaEmail = async () => {
    // Versi PDF: kita generate PDF lalu attach => lumayan kompleks
    // Simpelnya, kita pakai mailto dengan link
    const subject = encodeURIComponent("Assessment Report");
    let body = `Name: ${name}\nStudent ID: ${studentId}\n\nCourses:\n`;
    courses.forEach((c, i) => {
      body += `${i + 1}. ${c.courseName}, ${c.assessmentType}, ${c.hours} hours, Week ${c.week}\n`;
    });
    body += "\nSummary By Week:\n";
    Object.keys(summaryByWeek).forEach((w) => {
      body += `Week ${w}: ${summaryByWeek[w]} hours\n`;
    });

    window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(
      body
    )}`;
  };

  return (
    <div>
      <h2>Welcome, {name} (ID: {studentId})</h2>
      <button onClick={onLogout} style={{ float: "right" }}>
        Logout
      </button>

      <h3>Enter Course & Assessment</h3>
      <form onSubmit={handleAddCourse}>
        <label>
          Course Name:{" "}
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Assessment Type:{" "}
          <input
            type="text"
            value={assessmentType}
            onChange={(e) => setAssessmentType(e.target.value)}
          />
        </label>
        <br />
        <label>
          Hours (including preparation):{" "}
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </label>
        <br />
        <label>
          Week:{" "}
          <input
            type="number"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Add Course</button>
      </form>

      <hr />

      {/* 1) Summary di halaman yang sama */}
      <h3>Current Courses</h3>
      {courses.length === 0 ? (
        <p>No courses added yet.</p>
      ) : (
        <ul>
          {courses.map((c, i) => (
            <li key={i}>
              {c.courseName} | {c.assessmentType} | {c.hours} hours | Week {c.week}
            </li>
          ))}
        </ul>
      )}

      <h3>Summary By Week</h3>
      {Object.keys(summaryByWeek).length === 0 ? (
        <p>No data yet.</p>
      ) : (
        <ul>
          {Object.keys(summaryByWeek).map((w) => (
            <li key={w}>
              Week {w}: {summaryByWeek[w]} hours
            </li>
          ))}
        </ul>
      )}

      {/* Tombol Save, Download, Share */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDownloadPdf} style={{ marginLeft: 8 }}>
          Download PDF
        </button>
        <button onClick={handleShareViaEmail} style={{ marginLeft: 8 }}>
          Share via Email
        </button>
      </div>
    </div>
  );
}

// =====================================
// PARENT COMPONENT
// =====================================
const AssessmentLoadTracker = ({ onLogout }) => {
  const [step, setStep] = useState(1);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");

  const handleNextFromStep1 = ({ name, studentId }) => {
    setStudentName(name);
    setStudentId(studentId);
    setStep(2);
  };

  // handleLogout simple: panggil onLogout
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      {step === 1 && <StudentInfoForm onNext={handleNextFromStep1} />}
      {step === 2 && (
        <CourseAndSummaryPage
          name={studentName}
          studentId={studentId}
          onLogout={handleLogoutClick}
        />
      )}
    </div>
  );
};

export default AssessmentLoadTracker;
