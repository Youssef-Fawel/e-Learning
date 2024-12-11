const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Développement Web', 'Design', 'Marketing', 'Business','Programmation', 'Cybersecurity','Other']
  },
  level: {
    type: String,
    required: true,
    enum: ['Débutant', 'Intermédiaire', 'Avancé']
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  isFree: {
    type: Boolean,
    default: false
  },
  isNewCourse: {
    type: Boolean,
    default: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  students: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Course', courseSchema);
