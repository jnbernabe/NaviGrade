// models/Student.js

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;