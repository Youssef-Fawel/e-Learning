import { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const location = useLocation();

  // Check both authentication and role authorization
  const isAuthorized = token && user && (!allowedRoles.length || allowedRoles.includes(user.role));

  return isAuthorized ? children : (
    <Navigate 
      to="/login" 
      replace 
      state={{ from: location }} 
    />
  );
}

export default ProtectedRoute;
