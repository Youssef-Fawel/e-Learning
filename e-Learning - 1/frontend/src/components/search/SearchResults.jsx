import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Box, Chip, Rating } from '@mui/material';
import { AccessTime, Person } from '@mui/icons-material';

const SearchResults = ({ courses }) => {
  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course._id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '16px',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image={course.image}
              alt={course.title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                {course.title}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={course.category}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  label={course.level}
                  size="small"
                  sx={{ mb: 1 }}
                  color={
                    course.level === 'Débutant' ? 'success' :
                    course.level === 'Intermédiaire' ? 'warning' : 'error'
                  }
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={course.rating} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({course.students})
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime fontSize="small" />
                  <Typography variant="body2">
                    {course.duration}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Person fontSize="small" />
                  <Typography variant="body2">
                    {course.students}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" color="primary">
                {course.isFree ? 'Gratuit' : `${course.price}€`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SearchResults;
