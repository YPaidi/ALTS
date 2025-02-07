import './App.css';
import React, { useState } from "react";
import CourseForm from "./components/CourseForm";

const App = () => {
  const [studentInfo, setStudentInfo] = useState({ id: "", name: "" });
  const [submittedData, setSubmittedData] = useState([]);
  const [isStudentInfoSaved, setIsStudentInfoSaved] = useState(false);

  const handleStudentInfoSubmit = () => {
    if (!studentInfo.id || !studentInfo.name) {
      alert("Please fill in the student name and ID.");
      return;
    }
saveStudentInfo(); // Panggil API untuk simpan data
    setIsStudentInfoSaved(true);
  };

const API_BASE_URL = "https://assessment-load-tracker-for-students.onrender.com";

const saveStudentInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentInfo),
    });

    if (!response.ok) {
      throw new Error("Failed to save student information");
    }
    const data = await response.json();
    console.log("Student info saved:", data);
  } catch (error) {
    console.error("Error saving student information:", error);
  }
};

  const handleFormSubmit = (courseData) => {
    if (!courseData.name || !Array.isArray(courseData.assessments)) {
      alert("Invalid course data.");
      return;
    }
  saveCourseInfo(courseData); // Panggil API untuk simpan data
    setSubmittedData([...submittedData, courseData]);
  };

const saveCourseInfo = async (courseData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: studentInfo.id, ...courseData }),
    });

    if (!response.ok) {
      throw new Error("Failed to save course information");
    }
    const data = await response.json();
    console.log("Course info saved:", data);
  } catch (error) {
    console.error("Error saving course information:", error);
  }
};

  const groupByCourse = (data) => {
    return data.reduce((result, current) => {
      const { name, assessments } = current;

      if (!Array.isArray(assessments)) return result;

      if (!result[name]) {
        result[name] = [];
      }
      result[name] = [...result[name], ...assessments];
      return result;
    }, {});
  };

  const calculateWeeklySummary = (data) => {
    const weeklySummary = {};

    Object.values(data).forEach((assessments) => {
      assessments.forEach((assessment) => {
        const week = assessment.week;
        const hours = assessment.weight;

        if (!weeklySummary[week]) {
          weeklySummary[week] = 0;
        }
        weeklySummary[week] += hours;
      });
    });

    return Object.entries(weeklySummary).map(([week, totalHours]) => ({
      week,
      totalHours,
    }));
  };

  const groupedCourses = groupByCourse(submittedData);

  return (
    <div className="App">
      <h1>Assessment Load Tracker for Students</h1>

      {!isStudentInfoSaved ? (
        <div>
          <h2>Enter Student Information</h2>
          <label>
            Student Name:
            <input
              type="text"
              placeholder="Student Name"
              value={studentInfo.name}
              onChange={(e) =>
                setStudentInfo({ ...studentInfo, name: e.target.value })
              }
            />
          </label>
          <br />
          <label>
            Student ID:
            <input
              type="text"
              placeholder="Student ID"
              value={studentInfo.id}
              onChange={(e) =>
                setStudentInfo({ ...studentInfo, id: e.target.value })
              }
            />
          </label>
          <br />
          <button onClick={handleStudentInfoSubmit}>
            Save Student Information
          </button>
        </div>
      ) : (
        <>
          <h2>Enter Course and Assessments</h2>
          <p>
            <strong>Student ID:</strong> {studentInfo.id}
          </p>
          <p>
            <strong>Student Name:</strong> {studentInfo.name}
          </p>

          <CourseForm onSubmit={handleFormSubmit} />

          <h2>Submitted Data</h2>
          {Object.entries(groupedCourses).map(([courseName, assessments]) => (
            <div key={courseName}>
              <h3>Course: {courseName}</h3>
              <ul>
                {assessments.map((assessment, index) => (
                  <li key={index}>
                    {assessment.type} - {assessment.weight} hours (Week{" "}
                    {assessment.week})
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <h2>Summary by Week</h2>
          <ul>
            {calculateWeeklySummary(groupedCourses).map((item, index) => (
              <li key={index}>
                Week {item.week}: {item.totalHours} hours
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
