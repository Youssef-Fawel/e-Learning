import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import CourseDetail from './components/CourseDetail';
import SearchCourses from './components/search/SearchCourses';
import StudentDashboard from './components/dashboards/student/StudentDashboard';
import InstructorDashboard from './components/dashboards/instructor/InstructorDashboard';
import AdminDashboard from './components/dashboards/admin/AdminDashboard';
import DashboardNavbar from './components/dashboards/DashboardNavbar';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#64b5f6',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#636e72',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.2 },
    h2: { fontWeight: 600, fontSize: '2rem', lineHeight: 1.3 },
    h3: { fontWeight: 600, fontSize: '1.75rem' },
    h4: { fontWeight: 600, fontSize: '1.5rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function AppContent() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.includes('/dashboard');
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideNavbar && (isDashboardRoute ? <DashboardNavbar /> : <Navbar />)}
      <Box sx={{ pt: 8, flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/search" element={<SearchCourses />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
