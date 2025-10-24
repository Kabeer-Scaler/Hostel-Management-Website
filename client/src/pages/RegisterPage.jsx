import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { registerUser } from '../services/apiService.js'; // We'll import register directly

const RegisterPage = () => {
  // 1. Get the login function from our AuthContext
  // We'll log the user in automatically after they register
  const { login } = useAuth();
  const navigate = useNavigate();

  // 2. Form state for all fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 3. UI state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 4. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // --- Client-side validation ---
    if (!name || !email || !password || !confirmPassword) {
      return setError('Please fill in all fields.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 6) {
      // Assuming your backend has a minimum password length
      return setError('Password must be at least 6 characters.');
    }
    // --- End validation ---

    try {
      setLoading(true);

      // 1. Call the API to register the new user
      // We don't use the context for this, we call apiService directly
      await registerUser(name, email, password);

      // 2. If registration is successful, log them in
      // This will run the login flow in our AuthContext
      await login(email, password);

      // 3. Redirect to the main dashboard
      navigate('/');

    } catch (err) {
      // Handle errors from the backend (e.g., "User already exists")
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // We can reuse the same CSS classes from the login form
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Show error message if it exists */}
        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Register'}
        </button>

        <p className="form-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;