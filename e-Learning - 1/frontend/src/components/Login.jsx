import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, Box, IconButton, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Google, LinkedIn } from '@mui/icons-material';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Updated routing logic
      switch(response.data.user.role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'teacher':
          navigate('/instructor/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Rest of your component remains the same
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
              Bienvenue
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                margin="normal"
                value={formData.email}
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
                label="Mot de passe"
                name="password"
                type="password"
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{
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
                  mt: 3,
                  mb: 2,
                  borderRadius: '12px',
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                }}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>

              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Ou connectez-vous avec
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <IconButton sx={{ mx: 1, bgcolor: '#f8f9fa' }}>
                    <Google />
                  </IconButton>
                  <IconButton sx={{ mx: 1, bgcolor: '#f8f9fa' }}>
                    <Facebook />
                  </IconButton>
                  <IconButton sx={{ mx: 1, bgcolor: '#f8f9fa' }}>
                    <LinkedIn />
                  </IconButton>
                </Box>
              </Box>

              <Typography align="center" sx={{ mt: 2 }} color="text.secondary">
                Pas encore de compte? {' '}
                <Link to="/signup" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 600 }}>
                  S'inscrire
                </Link>
              </Typography>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
