import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx'; // Import context directly
import { getMyProfile } from '../services/apiService.js';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // We need to get the 'dispatch' function from our context
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    // Get the token from the URL query string
    const token = searchParams.get('token');

    if (token) {
      // 1. Save the new token to local storage
      localStorage.setItem('token', token);

      // 2. We must manually update our app's global state
      const loadUserAndLogin = async () => {
        try {
          // Call 'getMyProfile'. Our apiService will
          // automatically use the token we just saved.
          const response = await getMyProfile(); 

          // 3. Dispatch the LOGIN_SUCCESS action with the user and token
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data,
              token: token,
            },
          });

          // 4. All done! Send the user to their dashboard.
          navigate('/');

        } catch (err) {
          // The token was bad or something went wrong
          dispatch({ type: 'AUTH_ERROR' });
          navigate('/login');
        }
      };

      loadUserAndLogin();

    } else {
      // No token was found in the URL. Send back to login.
      navigate('/login');
    }
  }, [searchParams, navigate, dispatch]); // Dependencies

  // You can show a simple loading message
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Loading...</h1>
      <p>Please wait while we log you in.</p>
    </div>
  );
};

export default AuthCallback;