const express = require("express");

const cors = require("cors");
require("dotenv").config({ path: "./loadEnvironment.mjs" });
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const dbo = require("./db/conn");


const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Load the /posts routes
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/assignments", assignmentRoutes);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, async () => {
  // perform a database connection when server starts
  await dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: http://localhost:${PORT}/`);
});
