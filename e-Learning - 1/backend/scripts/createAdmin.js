const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = 'mongodb://localhost:27017/elearning';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const createAdmin = async () => {
  try {
    const adminData = {
      firstName: "Admin",
      lastName: "System",
      email: "admin@admin.com",
      password: "admin123456",
      role: "admin"
    };

    const admin = new User(adminData);
    await admin.save();
    console.log('Admin created successfully');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
