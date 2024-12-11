const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Create a new course
router.post('/', auth, async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user.userId,
      price: req.body.isFree ? 0 : Number(req.body.price)
    };

    const course = new Course(courseData);
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single course by ID
router.get('/course/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName email');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get instructor's courses
router.get('/instructor', auth, async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a course
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      {
        _id: req.params.id,
        instructor: req.user.userId
      },
      req.body,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a course (admin can delete any course)
router.delete('/:id', auth, async (req, res) => {
  try {
    let course;
    
    if (req.user.role === 'admin') {
      course = await Course.findByIdAndDelete(req.params.id);
    } else {
      course = await Course.findOneAndDelete({
        _id: req.params.id,
        instructor: req.user.userId
      });
    }

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully', courseId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
