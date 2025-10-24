import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const GOOGLE_AUTH_URL = 'https://hostel-management-website-jkl3.onrender.com/api/auth/google';

const LoginPage = () => {
  // 1. Get the login function from our AuthContext
  const { login } = useAuth();
  
  // 2. Get the navigate function to redirect after login
  const navigate = useNavigate();

  // 3. Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 4. UI state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 5. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the form from refreshing the page
    setError(null); // Clear any previous errors

    if (!email || !password) {
      return setError('Please fill in all fields.');
    }

    try {
      setLoading(true);
      // This is the function from AuthContext.js
      await login(email, password); 
      
      // If login is successful, AuthContext will update its state
      // and we redirect the user to their dashboard
      navigate('/'); 

    } catch (err) {
      // If login fails (e.g., wrong password), apiService throws an error
      setError('Invalid email or password. Please try again.');
    } finally {
      // Always stop loading, whether success or fail
      setLoading(false); 
    }
  };

  const handleGoogleLogin = () => {
    // This will redirect the user to your backend route
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    // We'll add a class for basic styling
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Hostel Login</h2>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Show error message if it exists */}
        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button 
          type="button" 
          onClick={handleGoogleLogin} 
          className="google-btn"
        >
          Sign in with Google
        </button>

        <p className="form-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
