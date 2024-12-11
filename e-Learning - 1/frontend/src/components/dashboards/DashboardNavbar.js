import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { School, Logout } from '@mui/icons-material';
import { motion } from 'framer-motion';

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 70 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <School sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {user?.role === 'admin' ? 'Admin Dashboard' : 
                   user?.role === 'teacher' ? 'Teacher Dashboard' : 
                   'Student Dashboard'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography>
                  {user?.firstName} {user?.lastName} ({user?.role})
                </Typography>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<Logout />}
                >
                  Déconnexion
                </Button>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </motion.div>
  );
};

export default DashboardNavbar;
