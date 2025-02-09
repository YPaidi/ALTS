const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  assessments: [
    {
      type: { type: String },
      week: { type: Number },
      weight: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Course", CourseSchema);
