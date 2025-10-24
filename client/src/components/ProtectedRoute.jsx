import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Show a loading spinner or message while auth state is being checked
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // If not logged in, redirect them to the login page
    // `replace` stops them from using the back button to go back to the protected page
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, render the child component
  // (e.g., <StudentDashboard />)
  return <Outlet />;
};

export default ProtectedRoute;