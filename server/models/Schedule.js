const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});
const Course = mongoose.model('Schedule', scheduleSchema);

module.exports = Course;