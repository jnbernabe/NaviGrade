// models/Assignment.js

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  name: String,
  dueDate: Date,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  grades: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    score: Number,
  }],
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
