const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dataRoutes = require("./routes/dataRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/assessment-tracker")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB error:", err));

// Gunakan dataRoutes
app.use(dataRoutes);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
