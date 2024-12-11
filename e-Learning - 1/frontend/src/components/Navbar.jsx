import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Box, Container, Stack, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, useScrollTrigger } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { School, Search, Menu, Close, Category, LibraryBooks, Info } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const menuItems = [
    { label: 'Catégories', section: 'categories-section', icon: <Category /> },
    { label: 'Cours', section: 'courses-section', icon: <LibraryBooks /> },
    { label: 'À propos', section: 'about-section', icon: <Info /> }
  ];

  const handleSearchClick = () => {
    navigate('/search');
    setMobileOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Menu
        </Typography>
        <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'primary.main' }}>
          <Close />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.label}
            onClick={() => scrollToSection(item.section)}
            sx={{
              borderRadius: '12px',
              mb: 1,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem 
          button 
          onClick={handleSearchClick}
          sx={{
            borderRadius: '12px',
            mb: 1,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Search />
          </ListItemIcon>
          <ListItemText primary="Rechercher" />
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/login"
          sx={{
            borderRadius: '12px',
            mb: 1,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            }
          }}
        >
          <ListItemText primary="Connexion" />
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/signup"
          sx={{
            borderRadius: '12px',
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }}
        >
          <ListItemText primary="Inscription" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: trigger ? 'white' : 'transparent',
          boxShadow: trigger ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 70 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {/* Left Section */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <School sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
                </motion.div>
                <Typography
                  variant="h6"
                  component={Link}
                  to="/"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    fontWeight: 700,
                    letterSpacing: '.2rem',
                    color: 'primary.main',
                    textDecoration: 'none',
                  }}
                >
                  E-LEARNING
                </Typography>
              </Box>

              {/* Center Section */}
              <Stack 
                direction="row" 
                spacing={2} 
                sx={{ 
                  flexGrow: 1,
                  justifyContent: 'center',
                  display: { xs: 'none', md: 'flex' }
                }}
              >
                {menuItems.map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={() => scrollToSection(item.section)}
                      sx={{ 
                        color: 'text.primary',
                        px: 2,
                        borderRadius: '12px',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
              </Stack>

              {/* Right Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton 
                  size="large" 
                  onClick={handleSearchClick}
                  sx={{ 
                    color: 'primary.main',
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.15)',
                    }
                  }}
                >
                  <Search />
                </IconButton>
                
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      component={Link} 
                      to="/login"
                      variant="outlined" 
                      sx={{ 
                        borderRadius: '12px',
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Connexion
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      component={Link} 
                      to="/signup"
                      variant="contained" 
                      sx={{ 
                        borderRadius: '12px',
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                      }}
                    >
                      Inscription
                    </Button>
                  </motion.div>
                </Box>

                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{ 
                    display: { xs: 'flex', md: 'none' }, 
                    color: 'primary.main',
                  }}
                >
                  <Menu />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: 280,
            borderRadius: '20px 0 0 20px'
          },
        }}
      >
        {drawer}
      </Drawer>
    </motion.div>
  );
};

export default Navbar;
