// server/routes/completedAssignmentRoutes.js

const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Student = require('../models/Student');
const { authenticateToken } = require('../middleware/authMiddleware'); // Import the authenticateToken middleware

// Route to mark an assignment as completed for a student
// router.post("/:assignmentId/mark-completed/:studentId", authenticateToken, async (req, res) => {
//   try {
//     const { assignmentId, studentId } = req.params;

//     // Check if the student exists
//     const student = await Student.findById(studentId);
//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     // Check if the assignment exists
//     const assignment = await Assignment.findById(assignmentId);
//     if (!assignment) {
//       return res.status(404).json({ message: "Assignment not found" });
//     }

//     // Mark the assignment as completed for the student
//     student.completedAssignments.push(assignmentId);
//     await student.save();

//     res.status(200).json({ message: "Assignment marked as completed successfully" });
//   } catch (error) {
//     console.error('Error marking assignment as completed:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

router.post("/mark-completed/:assignmentId", authenticateToken, async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const { studentId } = req.body; // Update to get studentId from the request body
  
      // Check if the student exists
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      // Check if the assignment exists
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
  
      // Mark the assignment as completed for the student
      student.completedAssignments.push(assignmentId);
      await student.save();
  
      res.status(200).json({ message: "Assignment marked as completed successfully" });
    } catch (error) {
      console.error('Error marking assignment as completed:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
