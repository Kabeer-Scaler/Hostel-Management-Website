import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authReducer, initialState } from './authReducer.js';
import { getMyProfile, loginUser as apiLogin } from '../services/apiService.js';

export const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in (when app first loads)
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Get user profile from backend
          const response = await getMyProfile();

          // We got the user, dispatch login success
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data,
              token: token,
            },
          });
        } catch (err) {
          // Token is invalid or expired
          dispatch({ type: 'AUTH_ERROR' });
        }
      } else {
        // No token found
        dispatch({ type: 'AUTH_ERROR' });
      }
    };

    loadUser();
  }, []); // Empty array means this runs once on app start

  // --- Define Actions ---

  // Login Action
  const login = async (email, password) => {
    try {
      // Call the API function we made in apiService.js
      const response = await apiLogin(email, password);

      // Dispatch success
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data, // This is { _id, name, email, role }
          token: response.data.token,
        },
      });
    } catch (err) {
      console.error('Login failed', err);
      dispatch({ type: 'AUTH_ERROR' });
      // Re-throw error so login page can show it
      throw err; 
    }
  };

  // Logout Action
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // 3. Provide the state and actions to children
  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        dispatch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 4. Create a Custom Hook for easy access
export const useAuth = () => {
  return useContext(AuthContext);
};