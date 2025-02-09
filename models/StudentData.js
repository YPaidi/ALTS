// models/StudentData.js
const mongoose = require("mongoose");

const StudentDataSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true },
  studentId: String,
  assessments: [
    {
      courseCode: String,
      assessmentType: String,
      hours: Number,
      week: Number,
    },
  ],
});

module.exports = mongoose.model("StudentData", StudentDataSchema);
