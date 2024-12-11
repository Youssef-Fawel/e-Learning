import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  IconButton, 
  Tooltip,
  useTheme 
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import {
  People, 
  School, 
  Assessment,
  TrendingUp, 
  MonetizationOn, 
  Delete,
  ArrowUpward,
  Refresh
} from '@mui/icons-material';
import axios from 'axios';

function AdminDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    userCount: 0,
    courseCount: 0,
    revenue: 0,
    userGrowth: '+12%',
    courseGrowth: '+5%',
    revenueGrowth: '+8%'
  });

  useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      
      if (!user || !token || user.role !== 'admin') {
        navigate('/login');
        return false;
      }
      return true;
    };

    if (checkAuth()) {
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!user || !token || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    try {
      const [usersResponse, coursesResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/courses', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const formattedUsers = usersResponse.data.map(user => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        status: 'Actif',
        joinDate: new Date(user.createdAt).toLocaleDateString()
      }));

      const formattedCourses = coursesResponse.data.map(course => ({
        id: course._id,
        title: course.title,
        instructor: course.instructor?.firstName ? 
          `${course.instructor.firstName} ${course.instructor.lastName}` : 'Unknown',
        price: course.price,
        category: course.category,
        students: course.students || 0,
        rating: course.rating || 0
      }));

      setUsers(formattedUsers);
      setCourses(formattedCourses);
      setStats({
        ...stats,
        userCount: formattedUsers.length,
        courseCount: formattedCourses.length,
        revenue: coursesResponse.data.reduce((acc, course) => acc + course.price, 0)
      });
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!currentUser || !token || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user.id !== id));
      setStats(prev => ({ ...prev, userCount: prev.userCount - 1 }));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!currentUser || !token || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(courses.filter(course => course.id !== id));
      setStats(prev => ({ ...prev, courseCount: prev.courseCount - 1 }));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
      console.error('Error deleting course:', error);
    }
  };

  const userColumns = [
    { field: 'name', headerName: 'Nom', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Rôle', width: 130 },
    { field: 'status', headerName: 'Statut', width: 130 },
    { field: 'joinDate', headerName: 'Date d\'inscription', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDeleteUser(params.id)}
          color="error"
        />
      ]
    }
  ];

  const courseColumns = [
    { field: 'title', headerName: 'Titre', flex: 1 },
    { field: 'instructor', headerName: 'Formateur', flex: 1 },
    { field: 'category', headerName: 'Catégorie', width: 150 },
    { 
      field: 'price', 
      headerName: 'Prix', 
      width: 100,
      renderCell: (params) => `€${params.value}` 
    },
    { field: 'students', headerName: 'Étudiants', width: 120 },
    { 
      field: 'rating', 
      headerName: 'Note', 
      width: 100,
      renderCell: (params) => `${params.value}/5` 
    },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDeleteCourse(params.id)}
          color="error"
        />
      ]
    }
  ];

  const StatCard = ({ title, value, icon, growth, color }) => (
    <Card sx={{
      height: '100%',
      background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#475569', fontWeight: 600 }}>
            {title}
          </Typography>
          <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: `${color}.50` }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          {value}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          bgcolor: '#f0fdf4',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          width: 'fit-content'
        }}>
          <ArrowUpward sx={{ color: '#16a34a', fontSize: 16, mr: 0.5 }} />
          <Typography sx={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: 500 }}>
            {growth}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const sections = {
    analytics: {
      title: "Vue d'ensemble",
      icon: <Assessment sx={{ color: '#3b82f6' }} />,
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Utilisateurs"
              value={stats.userCount}
              icon={<People sx={{ color: '#3b82f6' }} />}
              growth={stats.userGrowth}
              color="blue"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Cours"
              value={stats.courseCount}
              icon={<School sx={{ color: '#8b5cf6' }} />}
              growth={stats.courseGrowth}
              color="purple"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Revenus"
              value={`€${stats.revenue}`}
              icon={<MonetizationOn sx={{ color: '#10b981' }} />}
              growth={stats.revenueGrowth}
              color="green"
            />
          </Grid>
        </Grid>
      )
    },
    userManagement: {
      title: "Utilisateurs",
      icon: <People sx={{ color: '#3b82f6' }} />,
      content: (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Tooltip title="Rafraîchir">
              <IconButton onClick={fetchData}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
          <DataGrid
            rows={users}
            columns={userColumns}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            sx={{
              border: 'none',
              backgroundColor: '#fff',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f0f0f0',
                padding: '16px',
                fontSize: '0.875rem'
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8fafc',
                borderBottom: '2px solid #e2e8f0',
                color: '#475569'
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f1f5f9'
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '2px solid #e2e8f0'
              }
            }}
          />
        </Box>
      )
    },
    courseManagement: {
      title: "Cours",
      icon: <School sx={{ color: '#3b82f6' }} />,
      content: (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Tooltip title="Rafraîchir">
              <IconButton onClick={fetchData}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
          <DataGrid
            rows={courses}
            columns={courseColumns}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            sx={{
              border: 'none',
              backgroundColor: '#fff',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f0f0f0',
                padding: '16px',
                fontSize: '0.875rem'
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8fafc',
                borderBottom: '2px solid #e2e8f0',
                color: '#475569'
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f1f5f9'
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '2px solid #e2e8f0'
              }
            }}
          />
        </Box>
      )
    }
  };

  return (
    <Box sx={{ p: 4, mt: 8, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
        Administration
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(sections).map(([key, section]) => (
          <Grid item xs={12} md={key === 'analytics' ? 12 : 6} key={key}>
            <Paper sx={{
              p: 3,
              height: '100%',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              background: '#fff',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  p: 1.5,                  borderRadius: '12px',
                  backgroundColor: '#f0f9ff',
                  mr: 2
                }}>
                  {section.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {section.title}
                </Typography>
              </Box>
              {section.content}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AdminDashboard;

