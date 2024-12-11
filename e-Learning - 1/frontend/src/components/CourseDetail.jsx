import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Tabs, Tab, Button, Paper, List, ListItem, 
         ListItemIcon, ListItemText, Chip, Grid, Card, CardMedia, CircularProgress } from '@mui/material';
import { PlayCircleOutline, Assignment, Quiz, Timer, Group, Star, CheckCircle } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseDetails = () => {
  const [value, setValue] = useState(0);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/course/${id}`);
        setCourse(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course:', error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const courseContent = {
    modules: [
      { title: 'Introduction et Vue d\'ensemble', duration: '4h' },
      { title: 'Concepts Fondamentaux', duration: '6h' },
      { title: 'Pratique et Exercices', duration: '8h' },
      { title: 'Projet Final et Évaluation', duration: '6h' }
    ],
    quizzes: [
      { title: 'Quiz de mi-parcours', duration: '30 min', questions: 20 },
      { title: 'Évaluation finale', duration: '45 min', questions: 25 }
    ],
    assignments: [
      { title: 'Projet pratique', deadline: '2 semaines', points: 100 },
      { title: 'Projet final', deadline: '3 semaines', points: 150 }
    ]
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Container sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Cours non trouvé
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Retour aux cours
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardMedia
              component="img"
              height="300"
              image={course.image}
              alt={course.title}
              sx={{ objectFit: 'cover' }}
            />
          </Card>

          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            {course.title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Chip label={course.category} color="primary" />
            <Chip label={course.level} color="secondary" />
            <Chip icon={<Timer />} label={course.duration} />
            <Chip icon={<Group />} label={`${course.students} étudiants`} />
            <Chip icon={<Star sx={{ color: '#ffc107' }} />} label={course.rating.toFixed(1)} />
          </Box>

          <Paper sx={{ mb: 4 }}>
            <Tabs value={value} onChange={handleChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Aperçu" />
              <Tab label="Contenu" />
              <Tab label="Quiz" />
              <Tab label="Projets" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {value === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Description du cours
                  </Typography>
                  <Typography paragraph>
                    {course.description}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{ mt: 2 }}
                  >
                    S'inscrire au cours
                  </Button>
                </Box>
              )}

              {value === 1 && (
                <List>
                  {courseContent.modules.map((module, index) => (
                    <ListItem key={index} sx={{ py: 2 }}>
                      <ListItemIcon>
                        <PlayCircleOutline color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={module.title}
                        secondary={`Durée: ${module.duration}`}
                      />
                      <Chip label="À venir" size="small" />
                    </ListItem>
                  ))}
                </List>
              )}

              {value === 2 && (
                <List>
                  {courseContent.quizzes.map((quiz, index) => (
                    <ListItem key={index} sx={{ py: 2 }}>
                      <ListItemIcon>
                        <Quiz color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={quiz.title}
                        secondary={`${quiz.questions} questions - ${quiz.duration}`}
                      />
                      <Button variant="outlined" size="small">
                        Commencer
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}

              {value === 3 && (
                <List>
                  {courseContent.assignments.map((assignment, index) => (
                    <ListItem key={index} sx={{ py: 2 }}>
                      <ListItemIcon>
                        <Assignment color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary={assignment.title}
                        secondary={`Date limite: ${assignment.deadline} - ${assignment.points} points`}
                      />
                      <Button variant="contained" size="small">
                        Soumettre
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Ce que vous apprendrez
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText primary="Maîtrise des fondamentaux" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText primary="Projets pratiques" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText primary="Certification professionnelle" />
              </ListItem>
            </List>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {course.isFree ? 'Gratuit' : `${course.price}€`}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate('/login')}
                sx={{ mt: 2 }}
              >
                S'inscrire maintenant
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetails;
