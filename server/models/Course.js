// models/Course.js

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  professor: { type: String, required: true },
  schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true }],
  startDate: { type: Date, required: true }, 
  endDate: { type: Date, required: true },
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
});
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
