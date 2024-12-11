const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const courseRoutes = require('./routes/courses');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/courses', courseRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/elearning', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
