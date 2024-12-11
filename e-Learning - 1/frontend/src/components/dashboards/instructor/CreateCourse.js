import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    level: '',
    duration: '',
    price: 0,
    isFree: false,
    isCertified: true,
    isPopular: false,
    isNew: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/courses', courseData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data) {
        navigate('/instructor/courses');
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Créer un nouveau cours</Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre du cours"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={courseData.description}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL de l'image"
                name="image"
                value={courseData.image}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  name="category"
                  value={courseData.category}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Développement Web">Développement Web</MenuItem>
                  <MenuItem value="Data Science">Data Science</MenuItem>
                  <MenuItem value="DevOps">DevOps</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Cloud Computing">Cloud Computing</MenuItem>
                  <MenuItem value="Cybersécurité">Cybersécurité</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Niveau</InputLabel>
                <Select
                  name="level"
                  value={courseData.level}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Débutant">Débutant</MenuItem>
                  <MenuItem value="Intermédiaire">Intermédiaire</MenuItem>
                  <MenuItem value="Avancé">Avancé</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Durée (ex: 20 heures)"
                name="duration"
                value={courseData.duration}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Prix (€)"
                name="price"
                value={courseData.price}
                onChange={handleChange}
                disabled={courseData.isFree}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={courseData.isFree}
                    onChange={handleChange}
                    name="isFree"
                  />
                }
                label="Cours gratuit"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={courseData.isCertified}
                    onChange={handleChange}
                    name="isCertified"
                  />
                }
                label="Certification disponible"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                Créer le cours
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateCourse;
