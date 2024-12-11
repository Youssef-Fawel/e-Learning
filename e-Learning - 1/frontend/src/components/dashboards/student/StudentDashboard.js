import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Typography, Paper, Card, CardContent, List, ListItem,
  Button, LinearProgress, Divider, Avatar, Chip, Rating, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import {
  School, Timeline, AccessTime, Category,
  TrendingUp, MonetizationOn, People, NewReleases
} from '@mui/icons-material';
import axios from 'axios';

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0
  });
  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'Tous' },
    { value: 'Développement Web', label: 'Développement Web' },
    { value: 'Programmation', label: 'Programmation' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Business', label: 'Business' },
    { value: 'Cybersecurity', label: 'Cybersecurity' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAllCourses();
  }, [navigate]);

  const fetchAllCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCourses(response.data);
      calculateStats(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const calculateStats = (coursesData) => {
    const stats = coursesData.reduce((acc, course) => ({
      totalStudents: acc.totalStudents + (course.students || 0),
      totalRevenue: acc.totalRevenue + (course.price || 0),
      averageRating: acc.averageRating + (course.rating || 0)
    }), { totalStudents: 0, totalRevenue: 0, averageRating: 0 });
    
    stats.averageRating = stats.averageRating / coursesData.length;
    setStats(stats);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    }
  };

  const filteredCourses = courses.filter(course => {
    const categoryMatch = selectedCategory === 'all' || course.category === selectedCategory;
    const newMatch = showNewOnly ? course.isNewCourse : true;
    const freeMatch = showFreeOnly ? course.isFree : true;
    return categoryMatch && newMatch && freeMatch;
  });

  const sections = {
    availableCourses: {
      title: "Catalogue des Cours",
      icon: <School color="primary" />,
      content: (
        <>
          <Box sx={{ mb: 3 }}>
            <ToggleButtonGroup
              value={selectedCategory}
              exclusive
              onChange={handleCategoryChange}
              aria-label="course categories"
              sx={{
                flexWrap: 'wrap',
                '& .MuiToggleButton-root': {
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '20px !important',
                  m: 0.5,
                  px: 2,
                  py: 0.5
                }
              }}
            >
              {categories.map((category) => (
                <ToggleButton
                  key={category.value}
                  value={category.value}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }
                  }}
                >
                  {category.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant={showNewOnly ? "contained" : "outlined"}
              onClick={() => setShowNewOnly(!showNewOnly)}
              startIcon={<NewReleases />}
              sx={{
                borderRadius: 2,
                backgroundColor: showNewOnly ? 'primary.main' : 'transparent',
                '&:hover': {
                  backgroundColor: showNewOnly ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Nouveaux Cours
            </Button>
            <Button
              variant={showFreeOnly ? "contained" : "outlined"}
              onClick={() => setShowFreeOnly(!showFreeOnly)}
              startIcon={<MonetizationOn />}
              sx={{
                borderRadius: 2,
                backgroundColor: showFreeOnly ? 'primary.main' : 'transparent',
                '&:hover': {
                  backgroundColor: showFreeOnly ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Cours Gratuits
            </Button>
          </Box>

          <List>
            {loading ? (
              <LinearProgress />
            ) : filteredCourses.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                Aucun cours ne correspond à vos critères de recherche.
              </Typography>
            ) : (
              filteredCourses.map((course) => (
                <ListItem
                  key={course._id}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    border: '1px solid #eee',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={2}>
                      <Avatar
                        src={course.image}
                        variant="rounded"
                        sx={{ width: 100, height: 100, cursor: 'pointer' }}
                        onClick={() => handleCourseClick(course._id)}
                      />
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleCourseClick(course._id)}
                      >
                        {course.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Category fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {course.category}
                        </Typography>
                        <Chip
                          label={course.level}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        {course.isNewCourse && (
                          <Chip
                            label="Nouveau"
                            size="small"
                            color="error"
                            icon={<NewReleases sx={{ fontSize: 16 }} />}
                          />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="body2">{course.duration}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <People fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="body2">{course.students} étudiants</Typography>
                        </Box>
                        <Rating value={course.rating} readOnly size="small" />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {course.isFree ? 'Gratuit' : `€${course.price}`}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{ borderRadius: 2 }}
                        onClick={() => handleCourseClick(course._id)}
                      >
                        S'inscrire
                      </Button>
                    </Grid>
                  </Grid>
                </ListItem>
              ))
            )}
          </List>
        </>
      )
    },
    statistics: {
      title: "Statistiques Globales",
      icon: <Timeline color="primary" />,
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <School />
                  <Typography variant="h6" sx={{ ml: 1 }}>Cours</Typography>
                </Box>
                <Typography variant="h4">{courses.length}</Typography>
                <Typography variant="body2">cours disponibles</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <People />
                  <Typography variant="h6" sx={{ ml: 1 }}>Étudiants</Typography>
                </Box>
                <Typography variant="h4">{stats.totalStudents}</Typography>
                <Typography variant="body2">étudiants inscrits</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp />
                  <Typography variant="h6" sx={{ ml: 1 }}>Note Moyenne</Typography>
                </Box>
                <Typography variant="h4">{stats.averageRating.toFixed(1)}/5</Typography>
                <Typography variant="body2">satisfaction globale</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Espace Apprentissage
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(sections).map(([key, section]) => (
          <Grid item xs={12} key={key}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {section.icon}
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                  {section.title}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {section.content}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default StudentDashboard;
