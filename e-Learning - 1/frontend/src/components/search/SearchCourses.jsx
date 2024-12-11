import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Container,
  Card,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Slider,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Rating
} from '@mui/material';
import { Search, FilterList, Timer, Star, Group } from '@mui/icons-material';

const SearchCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    duration: [0, 50],
    price: [0, 1000],
    isFree: false,
    isNewCourse: false
  });

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

  const categoryOptions = ['all', 'Développement Web', 'Programmation', 'Design', 'Marketing', 'Business', 'Cybersecurity'];
  const levelOptions = ['all', 'Débutant', 'Intermédiaire', 'Avancé'];

  const filteredCourses = courses.filter(course => {
    const courseDuration = parseInt(course.duration.split(' ')[0]);
    
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filters.category === 'all' || course.category === filters.category;
    const matchesLevel = filters.level === 'all' || course.level === filters.level;
    const matchesDuration = courseDuration >= filters.duration[0] && courseDuration <= filters.duration[1];
    const matchesPrice = course.price >= filters.price[0] && course.price <= filters.price[1];
    const matchesFree = !filters.isFree || (filters.isFree && course.isFree === true);
    const matchesNew = !filters.isNewCourse || (filters.isNewCourse && course.isNewCourse === true);

    return matchesSearch && matchesCategory && matchesLevel && matchesDuration &&
           matchesPrice && matchesFree && matchesNew;
  });

  const handleChipClick = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

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
    <Container maxWidth="xl" sx={{ mt: 12, mb: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Rechercher des cours
        </Typography>
        
        <TextField
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher des cours..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'primary.main' }} />,
            sx: {
              borderRadius: '16px',
              bgcolor: 'white',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }
            }
          }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, borderRadius: '16px' }}>
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList />
                Filtres
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={filters.category}
                  label="Catégorie"
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  {categoryOptions.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Niveau</InputLabel>
                <Select
                  value={filters.level}
                  label="Niveau"
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                >
                  {levelOptions.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Typography gutterBottom>Durée (heures)</Typography>
                <Slider
                  value={filters.duration}
                  onChange={(e, newValue) => setFilters({ ...filters, duration: newValue })}
                  valueLabelDisplay="auto"
                  min={0}
                  max={50}
                />
              </Box>

              <Box>
                <Typography gutterBottom>Prix (€)</Typography>
                <Slider
                  value={filters.price}
                  onChange={(e, newValue) => setFilters({ ...filters, price: newValue })}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                />
              </Box>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.isFree}
                      onChange={() => handleChipClick('isFree')}
                    />
                  }
                  label="Gratuit"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.isNewCourse}
                      onChange={() => handleChipClick('isNewCourse')}
                    />
                  }
                  label="Nouveau"
                />
              </FormGroup>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="text.secondary">
              {filteredCourses.length} résultats trouvés
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{
                    height: 160,
                    backgroundImage: `url(${course.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                  
                  <Box sx={{ p: 2, flexGrow: 1 }}>
                    <Stack spacing={1}>
                      <Chip
                        label={course.category}
                        size="small"
                        color="primary"
                        sx={{ alignSelf: 'flex-start' }}
                      />
                      <Typography variant="h6" noWrap>
                        {course.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {course.description}
                      </Typography>
                      
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Timer fontSize="small" />
                          <Typography variant="body2">{course.duration}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Rating value={course.rating} readOnly size="small" />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Group fontSize="small" />
                          <Typography variant="body2">{course.students}</Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" color="primary.main">
                          {course.isFree ? 'Gratuit' : `${course.price}€`}
                        </Typography>
                        <Chip
                          label={course.level}
                          size="small"
                          color={
                            course.level === 'Débutant' ? 'success' :
                            course.level === 'Intermédiaire' ? 'warning' : 'error'
                          }
                        />
                      </Stack>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchCourses;
