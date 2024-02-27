const express = require("express");

const cors = require("cors");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const gradeRoutes = require("./routes/gradesRoutes");


const mongoose = require("mongoose");

//mongoose.connect(process.env.ATLAS_URI);
const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Load the /posts routes
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/admin", adminRoutes);
app.use("/grades", gradeRoutes);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, async () => {

  // Wait for database to connect, logging an error if there is a problem
  main().catch((err) => console.log(err));
  async function main() {
  await mongoose.connect(process.env.ATLAS_URI);
}
  // perform a database connection when server starts
  console.log(`Server is running on port: http://localhost:${PORT}/`);
});
