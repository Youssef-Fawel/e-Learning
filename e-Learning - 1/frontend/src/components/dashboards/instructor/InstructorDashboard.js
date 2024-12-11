import React, { useState, useEffect, useContext, useCallback, memo } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton
} from '@mui/material';
import { School, Assignment, People, VideoLibrary, Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const CourseForm = memo(({ course, setCourse }) => {
  const handleInputChange = useCallback((field, value) => {
    setCourse(prevCourse => ({
      ...prevCourse,
      [field]: value
    }));
  }, [setCourse]);

  const levelOptions = ['Débutant', 'Intermédiaire', 'Avancé'];
  const categoryOptions = ['Développement Web', 'Programmation', 'Design', 'Marketing', 'Business', 'Cybersecurity'];

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        required
        fullWidth
        label="Titre"
        margin="normal"
        value={course.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        InputProps={{ autoComplete: 'off' }}
      />
      <TextField
        required
        fullWidth
        label="Description"
        margin="normal"
        multiline
        rows={4}
        value={course.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        InputProps={{ autoComplete: 'off' }}
      />
      <TextField
        required
        fullWidth
        label="Image URL"
        margin="normal"
        value={course.image}
        onChange={(e) => handleInputChange('image', e.target.value)}
        InputProps={{ autoComplete: 'off' }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Catégorie</InputLabel>
        <Select
          value={course.category}
          label="Catégorie"
          onChange={(e) => handleInputChange('category', e.target.value)}
        >
          {categoryOptions.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Niveau</InputLabel>
        <Select
          value={course.level}
          label="Niveau"
          onChange={(e) => handleInputChange('level', e.target.value)}
        >
          {levelOptions.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        required
        fullWidth
        label="Durée"
        margin="normal"
        value={course.duration}
        onChange={(e) => handleInputChange('duration', e.target.value)}
        InputProps={{ autoComplete: 'off' }}
      />
      <TextField
        fullWidth
        label="Prix"
        margin="normal"
        type="number"
        value={course.price}
        onChange={(e) => handleInputChange('price', Number(e.target.value))}
        disabled={course.isFree}
        InputProps={{ autoComplete: 'off' }}
      />
      <TextField
        fullWidth
        label="Nombre d'étudiants"
        margin="normal"
        type="number"
        value={course.students}
        onChange={(e) => handleInputChange('students', Number(e.target.value))}
        InputProps={{ autoComplete: 'off' }}
      />
      <TextField
        fullWidth
        label="Note"
        margin="normal"
        type="number"
        inputProps={{ min: 0, max: 5, step: 0.1 }}
        value={course.rating}
        onChange={(e) => handleInputChange('rating', Number(e.target.value))}
        InputProps={{ autoComplete: 'off' }}
      />
      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={course.isFree}
              onChange={(e) => {
                handleInputChange('isFree', e.target.checked);
                if (e.target.checked) handleInputChange('price', 0);
              }}
            />
          }
          label="Cours gratuit"
        />
        <FormControlLabel
          control={
            <Switch
              checked={course.isNewCourse}
              onChange={(e) => handleInputChange('isNewCourse', e.target.checked)}
            />
          }
          label="Nouveau cours"
        />
      </Box>
    </Box>
  );
});

function InstructorDashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    level: '',
    duration: '',
    price: 0,
    isFree: false,
    isNewCourse: true,
    students: 0,
    rating: 0
  });

  const fetchStudents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.filter(user => user.role === 'student'));
    } catch (err) {
      setError('Failed to fetch students');
    }
  }, []);

  const fetchInstructorCourses = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/courses/instructor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (err) {
      setError('Failed to fetch courses');
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      
      if (!user || !token || user.role !== 'teacher') {
        navigate('/login');
        return false;
      }
      return true;
    };

    if (checkAuth()) {
      fetchStudents();
      fetchInstructorCourses();
    }
  }, [navigate, fetchStudents, fetchInstructorCourses]);

  const handleCreateCourse = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(
        'http://localhost:5000/api/courses',
        { ...newCourse, instructor: userData._id || userData.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        setSuccess(true);
        await fetchInstructorCourses();
        setOpenDialog(false);
        setNewCourse({
          title: '',
          description: '',
          image: '',
          category: '',
          level: '',
          duration: '',
          price: 0,
          isFree: false,
          isNewCourse: true,
          students: 0,
          rating: 0
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    }
  }, [newCourse, fetchInstructorCourses]);

  const handleUpdateCourse = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/courses/${selectedCourse._id}`,
        selectedCourse,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        setSuccess(true);
        await fetchInstructorCourses();
        setOpenEditDialog(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course');
    }
  }, [selectedCourse, fetchInstructorCourses]);

  const handleDeleteCourse = useCallback(async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess(true);
        await fetchInstructorCourses();
      } catch (err) {
        setError('Failed to delete course');
      }
    }
  }, [fetchInstructorCourses]);

  const sections = {
    courseManagement: {
      title: "Mes Cours",
      icon: <School sx={{ color: '#3b82f6' }} />,
      content: (
        <>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{ mb: 2 }}
          >
            Ajouter un cours
          </Button>
          <List>
            {courses.map((course) => (
              <ListItem
                key={course._id}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => {
                        setSelectedCourse(course);
                        setOpenEditDialog(true);
                      }}
                      sx={{ color: '#22c55e' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteCourse(course._id)}
                      sx={{ color: '#ef4444' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={course.title}
                  secondary={`${course.category} | ${course.level} | ${course.duration} | Prix: ${course.isFree ? 'Gratuit' : `${course.price}€`}`}
                />
              </ListItem>
            ))}
          </List>
        </>
      )
    },
    students: {
      title: "Mes Étudiants",
      icon: <People sx={{ color: '#3b82f6' }} />,
      content: (
        <List>
          {students.map((student) => (
            <ListItem key={student._id}>
              <ListItemText
                primary={`${student.firstName} ${student.lastName}`}
                secondary={student.email}
              />
            </ListItem>
          ))}
        </List>
      )
    },
    assignments: {
      title: "Devoirs & Évaluations",
      icon: <Assignment sx={{ color: '#3b82f6' }} />,
      content: (
        <List>
          {[
            { title: 'Projet Final Python', dueDate: '15 Mars 2024' },
            { title: 'Quiz JavaScript', dueDate: '20 Mars 2024' },
            { title: 'TP React', dueDate: '25 Mars 2024' },
          ].map((assignment, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={assignment.title}
                secondary={`Date limite: ${assignment.dueDate}`}
              />
              <Button variant="outlined" size="small">Noter</Button>
            </ListItem>
          ))}
        </List>
      )
    },
    resources: {
      title: "Ressources Pédagogiques",
      icon: <VideoLibrary sx={{ color: '#3b82f6' }} />,
      content: (
        <List>
          {[
            'Vidéos de cours',
            'Documents PDF',
            'Exercices pratiques',
            'Ressources supplémentaires'
          ].map((resource, index) => (
            <ListItem key={index} button>
              <ListItemText primary={resource} />
            </ListItem>
          ))}
        </List>
      )
    }
  };

  return (
    <Box sx={{ p: 4, mt: 8, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Operation completed successfully!</Alert>}
      
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
        Espace Formateur
      </Typography>

      <Grid container spacing={3}>
        {Object.entries(sections).map(([key, section]) => (
          <Grid item xs={12} md={6} key={key}>
            <Paper sx={{
              p: 3,
              height: '100%',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              background: '#fff',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  backgroundColor: '#f0f9ff',
                  mr: 2
                }}>
                  {section.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {section.title}
                </Typography>
              </Box>
              {section.content}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Créer un nouveau cours</DialogTitle>
        <DialogContent>
          <CourseForm course={newCourse} setCourse={setNewCourse} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button
            onClick={handleCreateCourse}
            variant="contained"
            disabled={!newCourse.title || !newCourse.description || !newCourse.image || !newCourse.category || !newCourse.level || !newCourse.duration}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)} 
        maxWidth="md" 
        fullWidth
        key={selectedCourse?._id}
      >
        <DialogTitle>Modifier le cours</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <CourseForm course={selectedCourse} setCourse={setSelectedCourse} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Annuler</Button>
          <Button
            onClick={handleUpdateCourse}
            variant="contained"
            disabled={!selectedCourse?.title || !selectedCourse?.description || !selectedCourse?.image || !selectedCourse?.category || !selectedCourse?.level || !selectedCourse?.duration}
          >
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InstructorDashboard;
