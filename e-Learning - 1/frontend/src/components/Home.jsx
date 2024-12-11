import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box, Chip, TextField, InputAdornment, List, ListItem, ListItemIcon, ListItemText, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search, Timer, Star, Group, TrendingUp, CheckCircle, School, LaptopMac, Timeline, People } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Facebook, Twitter, LinkedIn } from '@mui/icons-material';
import { Link, Stack, IconButton } from '@mui/material';
import axios from 'axios';

const stats = [
  { icon: <School fontSize="large" />, count: '50+', label: 'Cours' },
  { icon: <LaptopMac fontSize="large" />, count: '1000+', label: 'Étudiants' },
  { icon: <Timeline fontSize="large" />, count: '95%', label: 'Taux de réussite' },
  { icon: <People fontSize="large" />, count: '40+', label: 'Instructeurs' },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = Array.from(new Set(courses.map(course => course.category)))
    .map(category => ({
      title: category,
      count: `${courses.filter(course => course.category === category).length} cours`
    }));

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
        color: 'white',
        py: 12,
        mb: 8,
        borderRadius: '0 0 50px 50px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" align="center" sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 800,
              mb: 3
            }}>
              Formez-vous aux métiers de demain
            </Typography>
            <Typography variant="h5" align="center" sx={{ mb: 6, opacity: 0.9 }}>
              Des cours de qualité pour développer vos compétences professionnelles
            </Typography>

            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
              <TextField
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un cours..."
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '28px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '28px',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </motion.div>

          <Grid container spacing={4} sx={{ mt: 8 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ mb: 2, color: 'white' }}>{stat.icon}</Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {stat.count}
                    </Typography>
                    <Typography variant="subtitle1">{stat.label}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container>
        {/* Categories Section */}
        <Box id="categories-section" sx={{ mb: 12 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" align="center" sx={{
              mb: 6,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #82b1ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}>
              Catégories
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={category.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px -12px rgba(0,0,0,0.2)',
                      background: 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)',
                    }
                  }}>
                    <Typography variant="h5" gutterBottom sx={{
                      fontWeight: 600,
                      color: 'primary.main',
                      mb: 2
                    }}>
                      {category.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{
                      fontWeight: 500,
                      background: '#e3f2fd',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2
                    }}>
                      {category.count}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Courses Section */}
        <Box id="courses-section" sx={{ mb: 12 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" align="center" sx={{
              mb: 6,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #82b1ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}>
              Nos Cours
            </Typography>
          </motion.div>

          {/* Category Tabs */}
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" spacing={2} sx={{
              overflowX: 'auto',
              pb: 2,
              '&::-webkit-scrollbar': { height: 6 },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#1976d2', borderRadius: 3 }
            }}>
              <Chip
                label="Tous"
                onClick={() => setActiveCategory('all')}
                sx={{
                  px: 3,
                  backgroundColor: activeCategory === 'all' ? '#1976d2' : 'transparent',
                  color: activeCategory === 'all' ? 'white' : 'inherit',
                  '&:hover': { backgroundColor: activeCategory === 'all' ? '#1976d2' : '#e3f2fd' }
                }}
              />
              {categories.map((category) => (
                <Chip
                  key={category.title}
                  label={category.title}
                  onClick={() => setActiveCategory(category.title)}
                  sx={{
                    px: 3,
                    backgroundColor: activeCategory === category.title ? '#1976d2' : 'transparent',
                    color: activeCategory === category.title ? 'white' : 'inherit',
                    '&:hover': { backgroundColor: activeCategory === category.title ? '#1976d2' : '#e3f2fd' }
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Courses Grid */}
          <Grid container spacing={4}>
            {filteredCourses.map((course, index) => (
              <Grid item xs={12} md={6} lg={4} key={course._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px -12px rgba(0,0,0,0.2)'
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={course.image}
                      alt={course.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={course.category}
                          color="primary"
                          size="small"
                          sx={{ mr: 1, borderRadius: '4px' }}
                        />
                        <Chip
                          label={course.level}
                          size="small"
                          sx={{
                            mr: 1,
                            borderRadius: '4px',
                            bgcolor: course.level === 'Débutant' ? '#4caf50' :
                              course.level === 'Intermédiaire' ? '#ff9800' : '#f44336',
                            color: 'white'
                          }}
                        />
                      </Box>

                      <Typography variant="h5" component="h2" sx={{
                        fontWeight: 600,
                        fontSize: '1.25rem',
                        lineHeight: 1.4
                      }}>
                        {course.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 60, overflow: 'hidden' }}>
                        {course.description}
                      </Typography>

                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        gap: 2,
                        justifyContent: 'space-between',
                        borderTop: '1px solid #eee',
                        borderBottom: '1px solid #eee',
                        py: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Timer sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {course.duration}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Group sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {course.students} étudiants
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Star sx={{ fontSize: 20, mr: 0.5, color: '#ffc107' }} />
                          <Typography variant="body2" color="text.secondary">
                            {course.rating}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 2,
                        mb: 2
                      }}>
                        <Typography variant="h6" sx={{
                          fontWeight: 700,
                          color: course.isFree ? '#4caf50' : 'primary.main'
                        }}>
                          {course.isFree ? 'Gratuit' : `${course.price} €`}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => navigate('/login')}                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            py: 1.5,
                            fontWeight: 600
                          }}
                        >
                          S'inscrire au cours
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => navigate(`/course/${course._id}`)}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            py: 1.5,
                            fontWeight: 600
                          }}
                        >
                          En savoir plus
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* About Section */}
        <Box id="about-section" sx={{ py: 12, bgcolor: 'white', borderRadius: '50px', mb: 8 }}>
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h2" align="center" sx={{
                mb: 6,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2, #82b1ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}>
                À propos de nous
              </Typography>
            </motion.div>

            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                    Notre Mission
                  </Typography>
                  <Typography paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                    Nous nous engageons à fournir une éducation de qualité accessible à tous.
                    Notre plateforme propose des cours créés par des experts de l'industrie
                    pour vous aider à développer vos compétences professionnelles.
                  </Typography>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                    Nos Valeurs
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Excellence académique"
                        secondary="Des cours de haute qualité validés par des experts"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Innovation continue"
                        secondary="Des contenus régulièrement mis à jour"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Accompagnement personnalisé"
                        secondary="Un suivi adapté à chaque apprenant"
                      />
                    </ListItem>
                  </List>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{
        bgcolor: '#1976d2',
        color: 'white',
        py: 3,
        mt: 6,
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.1)'
      }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              E-Learning Platform
            </Typography>

            <Stack direction="row" spacing={2}>
              <IconButton color="inherit" size="small">
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton color="inherit" size="small">
                <LinkedIn fontSize="small" />
              </IconButton>
            </Stack>

            <Typography variant="body2">
              © 2024 E-Learning Platform
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

