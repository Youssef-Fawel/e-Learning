import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Box, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { School, Person } from '@mui/icons-material';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      const dashboardRoutes = {
        teacher: '/instructor/dashboard',
        student: '/student/dashboard'
      };

      navigate(dashboardRoutes[formData.role] || '/');

    } catch (error) {
      setError(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pt: 8, pb: 6 }}>
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
            }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2, #82b1ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 4
              }}
            >
              Créer un compte
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Prénom"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Nom"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                />
              </Box>

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />

              <FormControl
                fullWidth
                required
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              >
                <InputLabel>Rôle</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Rôle"
                >
                  <MenuItem value="student">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <School fontSize="small" />
                      Apprenant
                    </Box>
                  </MenuItem>
                  <MenuItem value="teacher">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" />
                      Formateur
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Mot de passe"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />

              <TextField
                fullWidth
                label="Confirmer le mot de passe"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                }}
              >
                {loading ? 'Inscription en cours...' : 'S\'inscrire'}
              </Button>

              <Typography align="center" sx={{ mt: 3 }} color="text.secondary">
                Déjà inscrit? {' '}
                <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 600 }}>
                  Se connecter
                </Link>
              </Typography>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Signup;
