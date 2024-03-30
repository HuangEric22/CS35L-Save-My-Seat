const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the lecture schema
const discussionSchema = new Schema({
  alpha: String,
  location: String,
  time: String,
  instructors: String,
  status: String,
  capacity: String,
  waitlist: String,
  page: String
});

const lectureSchema = new Schema({
  num: String,
  title: String,
  location: String,
  time: String,
  days: String,
  instructors: [String], // Array of strings for instructor names
  status: String,
  capacity: String,
  waitlist: String,
  units: String,
  final_date: String,
  final_time: String,
  final_location: String,
  discussions: [discussionSchema]
});

// Define the main course schema
const classSchema = new Schema({
  _id: Schema.Types.ObjectId, 
  id: { type: String, required: true }, // e.g., "MATH 3C"
  course_abbrv: String, // e.g., "MATH"
  course_title: { type: String, required: true }, // Full title
  cat_num: { type: String, required: true }, // Catalogue number, e.g., "3C"
  
  lectures: [lectureSchema], // Array of lecture documents

  prereqs: [String], // Array of strings for prerequisite course IDs
  coreqs: [String], // Array of strings for corequisite course IDs

  course_page: { type: String, required: true }, // URL to the course page
  term: { type: String, required: true } // Term code, e.g., "24S"
});

const abbrvSchema = new Schema ( {
  _id: Schema.Types.ObjectId,
  name: String,
  abbreviation: String
});

const abbrvDict = mongoose.model('abbrvDict', abbrvSchema, "Abbreviations")
const Class = mongoose.model('Class', classSchema, 'Courses');

module.exports = {
  Class,
  abbrvDict
}
