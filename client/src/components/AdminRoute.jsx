import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Not logged in at all
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    // Logged in, but NOT an admin. Redirect them to their dashboard.
    return <Navigate to="/" replace />;
  }

  // If they are logged in AND an admin, render the child component
  return <Outlet />;
};

export default AdminRoute;