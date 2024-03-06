// // routes/studentRoutes.js
// import express from "express";
// import { ObjectId } from "mongodb";
// import Student from "../models/Student.js";

const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const Student = require("../models/Student.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Get all students
router.get("/", async (req, res) => {
  try {
    await Student.find({})
      .exec()
      .then((data) => {
        //console.log(data)
        res.json(data);
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific student
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).exec();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new student
router.post("/", async (req, res) => {
  try {
    const student = new Student({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password, // Remember to hash the password before storing it
      courses: [],
    });
    await Student.create(student);
    res.json({ message: "Student created!", id: student._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a student
router.patch("/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).exec();
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a student by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(
      req.params.id
    ).exec();
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted", id: deletedStudent._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
