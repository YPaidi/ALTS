import React, { useState } from "react";

const CourseForm = ({ onSubmit }) => {
  const [courseName, setCourseName] = useState("");
  const [assessmentType, setAssessmentType] = useState("");
  const [hours, setHours] = useState("");
  const [week, setWeek] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!courseName || !assessmentType || !hours || !week) {
      alert("Please fill in all fields.");
      return;
    }

    onSubmit({
      name: courseName,
      assessments: [
        {
          type: assessmentType,
          weight: parseInt(hours),
          week: parseInt(week),
        },
      ],
    });

    // Reset form
    setCourseName("");
    setAssessmentType("");
    setHours("");
    setWeek("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Course Name:
        <input
          type="text"
          placeholder="Enter course name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Assessment Type:
        <input
          type="text"
          placeholder="Enter assessment type"
          value={assessmentType}
          onChange={(e) => setAssessmentType(e.target.value)}
        />
      </label>
      <br />
      <label>
        Hours (including preparation):
        <input
          type="number"
          placeholder="Enter hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
      </label>
      <br />
      <label>
        Week:
        <input
          type="number"
          placeholder="Enter week"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit Data</button>
    </form>
  );
};

export default CourseForm;
