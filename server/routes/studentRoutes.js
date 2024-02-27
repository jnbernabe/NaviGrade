// // routes/studentRoutes.js
// import express from "express";
// import { ObjectId } from "mongodb";
// import Student from "../models/Student.js";

const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const Student = require("../models/Student.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    await Student.find({}).exec()
    .then((data) => {
      console.log(data)
      res.json(data);
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific student
router.get('/:id', async (req, res) => {
    try {
      const student = await Student.findById(req.params.id).exec();
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


// Create a new student
router.post('/', async (req, res) => {
  try {
    const student = new Student({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password, // Remember to hash the password before storing it
      courses: [],
    });
    await Student.create(student);
    res.json({ message: 'Student created!', id: student._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a student
router.patch('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id).exec();
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted', id: deletedStudent._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Signup route for students
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new student
    const newStudent = new Student({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save the new student to the database
    const savedStudent = await newStudent.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login route for students
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the student exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token in the response
    res.json({ token, studentId: student._id, expiresIn: 3600 }); // expiresIn is in seconds (1 hour in this example)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
