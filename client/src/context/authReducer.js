// This reducer's job is to manage state changes for our context.

// This is the initial state for our context
export const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true, // Start in loading state
};

// This function handles all state updates
export const authReducer = (state, action) => {
  switch (action.type) {
    // When login is successful:
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token); // Save token
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };

    // When user logs out:
    case 'LOGOUT':
      localStorage.removeItem('token'); // Clear token
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };

    // If login or profile fetch fails:
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };

    // When we are checking if user is logged in
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
};