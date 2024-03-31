//estimateGradeRoutes.js
const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");
const Student = require("../models/Student");

// Route to estimate final grade for a student
router.get("/estimate-grade/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get all completed assignments of the student
    const completedAssignments = await Assignment.find({
      student: studentId,
      grade: { $exists: true, $ne: null },
    });

    // Calculate the total grade based on completed assignments
    let totalGrade = 0;
    let totalWeight = 0;
    completedAssignments.forEach((assignment) => {
      totalGrade += assignment.grade * assignment.weight;
      totalWeight += assignment.weight;
    });

    // Calculate the estimated final grade
    const estimatedGrade = totalGrade / totalWeight;

    res.status(200).json({ estimatedGrade });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
