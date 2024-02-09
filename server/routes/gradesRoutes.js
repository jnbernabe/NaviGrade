// routes/gradeRoutes.js

const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');

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

//
