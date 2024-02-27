// routes/gradeRoutes.js

const express = require("express");
const { ObjectId } = require("mongodb");
const Grade = require("../models/Grade.js");
const router = express.Router();

// Get all grades
router.get('/', async (req, res) => {
  try {
    const grades = await Grade.find();
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific grade
router.get('/:id', async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    res.json(grade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new grade
router.post('/', async (req, res) => {
  const grade = new Grade({
    // Set the properties of the new grade based on the request body
    // For example:
    // name: req.body.name,
    // score: req.body.score,
    // ...
  });

  try {
    const newGrade = await grade.save();
    res.status(201).json(newGrade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a grade
router.patch('/:id', async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    // Update the properties of the grade based on the request body
    // For example:
    // grade.name = req.body.name;
    // grade.score = req.body.score;
    // ...
    const updatedGrade = await grade.save();
    res.json(updatedGrade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a grade
router.delete('/:id', async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    res.json({ message: 'Grade deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//
module.exports = router;