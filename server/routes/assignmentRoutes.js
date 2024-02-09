// routes/assignmentRoutes.js

const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// Get all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific assignment
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
  });

  try {
    const newAssignment = await assignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an assignment
router.patch('/:id', async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          dueDate: req.body.dueDate,
          course: req.body.course,
        },
      },
      { new: true }
    );
    res.json(updatedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

module.exports = router;
