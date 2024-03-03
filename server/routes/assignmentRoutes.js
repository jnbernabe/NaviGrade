// routes/assignmentRoutes.js

// import express from "express";

// import { ObjectId } from "mongodb";
// import Assignment from "../models/Assignment.js";

const express = require("express");
const Student = require('../models/Student');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');


const router = express.Router();


// Get all assignments
router.get('/', async (req, res) => {
  try {
    //console.log("headers",req.headers)
    await Assignment.find({}).exec().then((data) => {
      console.log(data)
      res.json(data);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific assignment  //e.g) localhost:5050/assignments/65debb6537494b5be4a7dfc0
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new assignment
router.post('/', async (req, res) => {
  const assignment = new Assignment({
    name: req.body.name,
    dueDate: req.body.dueDate,
    course: req.body.course,
    grade: req.body.grade,
    weight: req.body.weight,
    student: req.body.student
  });

  try {
    const newAssignment = await assignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to update an assignment
router.patch('/:assignmentId', async (req, res) => {
  const { assignmentId } = req.params;
  const { weight, grade, dueDate,name } = req.body;

  try {
    // Check if the assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Update the assignment fields
    if (weight !== undefined) {
      assignment.weight = weight;
    }

    if (grade !== undefined) {
      assignment.grade = grade;
    }

    if (dueDate !== undefined) {
      assignment.dueDate = dueDate;
    }

    if (name !== undefined) {
      assignment.name = name;
    }

    // Save the updated assignment to the database
    await assignment.save();

    res.status(200).json({ message: 'Assignment updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an assignment
router.delete('/:id', async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
    res.json(deletedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add an assignment
router.post('/add-assignment', async (req, res) => {
  const { name, dueDate,  courseId, weight, studentId } = req.body;
 
  try {
    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ message: 'Course not found' });
    }

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(400).json({ message: `Student with ID ${studentId} not found` });
    }

    // Check if the student is enrolled in the course
    if (!student.courses.includes(courseId.toString())) {
      return res.status(400).json({ message: 'Student is not enrolled in the course' });
    }

    // Create the assignment
    const assignment = new Assignment({
      name,
      dueDate,
      course: courseId,
      weight: weight || 1, // Default weight is set to 1 if not provided
      student: studentId,
    });

// Add the assignment to the course
course.assignments.push(assignment._id);

// Add the assignment to the student
student.assignments.push(assignment._id);

// Save the updated assignment, course, and student to the database
await Promise.all([assignment.save(), course.save(), student.save()]);
    

    // Save the assignment to the database
    await assignment.save();

    res.status(201).json({ message: 'Assignment added successfully', assignment : assignment._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:assignmentId/add-grade', async (req, res) => {
  const { assignmentId } = req.params;
  const { studentId, score } = req.body;

  try {
    // Check if the assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(400).json({ message: `Student with ID ${studentId} not found` });
    }

    // Check if the student is enrolled in the course associated with the assignment
    const course = await Course.findById(assignment.course);
    if (!course || !student.courses.includes(course._id.toString())) {
      return res.status(400).json({ message: 'Student is not enrolled in the course' });
    }

    // Update or add the grade for the student in the assignment
    assignment.grade = score;

    // Save the updated assignment to the database
    await assignment.save();

    res.status(201).json({ message: 'Grade added or updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
