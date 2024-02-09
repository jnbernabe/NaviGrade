// models/Grade.js

const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  score: Number,
});

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
