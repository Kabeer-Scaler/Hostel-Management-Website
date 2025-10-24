import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Hostel Management</Link>
      </div>
      <div className="navbar-links">
        {/* Common link for all logged-in users */}
        <Link to="/">Dashboard</Link>

        {/* Show admin-specific links */}
        {user?.role === 'admin' && (
          <>
            <Link to="/admin">Admin Home</Link>
            {/* We'll add more admin links later, e.g., /manage-rooms */}
          </>
        )}

        {/* Show student-specific links */}
        {user?.role === 'student' && (
          <>
            {/* We'll add more student links later, e.g., /my-complaints */}
          </>
        )}
      </div>
      <div className="navbar-user">
        {user ? (
          <>
            <span className="navbar-username">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;