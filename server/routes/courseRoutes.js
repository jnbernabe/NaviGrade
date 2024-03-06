// routes/courseRoutes.js

// import express from "express";

// import { ObjectId } from "mongodb";
// import Course from "../models/Course.js";

const express = require("express");
const { ObjectId } = require("mongodb");
const Course = require("../models/Course.js");
const Student = require("../models/Student.js");
const Schedule = require("../models/Schedule.js");

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific course
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new course
router.post("/", async (req, res) => {
  const { name, professor, schedules, startDate, endDate, assignments } =
    req.body;
  try {
    // Create a new schedule
    const newSchedule = new Schedule(schedules);
    await newSchedule.save();

    // Create a new course with the created schedule
    const newCourse = new Course({
      name,
      professor,
      schedules: [newSchedule._id], // Use the ID of the created schedule
      startDate,
      endDate,
      assignments,
    });

    await newCourse.save();
    res.status(201).json({
      message: "Course and schedule created successfully",
      course: newCourse,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a course
router.patch("/:id", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { name, professor, schedules, startDate, endDate, assignments } =
      req.body;

    // Update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $set: {
          name,
          professor,
          startDate,
          endDate,
          assignments,
        },
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update the schedules
    if (schedules && schedules.length > 0) {
      const updatedSchedules = await Promise.all(
        schedules.map(async (scheduleDetails, index) => {
          const scheduleId = updatedCourse.schedules[index];
          return Schedule.findByIdAndUpdate(
            scheduleId,
            {
              $set: scheduleDetails,
            },
            { new: true }
          );
        })
      );

      // Check if any schedule update failed
      if (updatedSchedules.some((schedule) => !schedule)) {
        return res.status(404).json({ message: "Some schedules not found" });
      }
    }

    res.json({
      message: "Course and schedules updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course and schedules:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a course
router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    res.json(deletedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add a course for a student
router.post("/:studentid/add-course", async (req, res) => {
  const { courseId } = req.body;
  const { studentid } = req.params;
  try {
    // Check if the student exists
    const student = await Student.findById(studentid);
    if (!student) {
      console.log("Student not found");
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      console.log("Course not found");
      return res.status(400).json({ message: "Course not found" });
    }

    // Check if the student is already enrolled in the course
    if (!student.courses.includes(courseId)) {
      console.log("Student is not enrolled in the course");
      return res
        .status(400)
        .json({ message: "Student is already enrolled in the course" });
    }

    // Add the course to the student's courses array
    student.courses.push(courseId);

    // Save the updated student to the database
    const updatedStudent = await student.save();
    //console.log("Student course Added");
    res.status(201).json(updatedStudent);
  } catch (error) {
    console.log("Error adding course to student", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
