// models/Course.js

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: String,
  professor: String,
  schedule: String,
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
