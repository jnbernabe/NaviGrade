// routes/courseRoutes.js

// import express from "express";

// import { ObjectId } from "mongodb";
// import Course from "../models/Course.js";

const express = require("express");
const { ObjectId } = require("mongodb");
const Course = require("../models/Course.js");
const Student = require("../models/Student.js");

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new course
router.post('/', async (req, res) => {
  const course = new Course({
    name: req.body.name,
    professor: req.body.professor,
    schedule: req.body.schedule,
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a course
router.patch('/:id', async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          professor: req.body.professor,
          schedule: req.body.schedule,
        },
      },
      { new: true }
    );
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a course
router.delete('/:id', async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    res.json(deletedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a course for a student
router.post('/:studentid/add-course', async (req, res) => {
  const { courseId } = req.body;
  const { studentid } = req.params;
  try {
    // Check if the student exists
    const student = await Student.findById(studentid);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      course = new Course();
    }

    // Check if the student is already enrolled in the course
    if (student.courses.includes(courseId)) {
      return res.status(400).json({ message: 'Student is already enrolled in the course' });
    }

    // Add the course to the student's courses array
    student.courses.push(courseId);

    // Save the updated student to the database
    const updatedStudent = await student.save();

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
