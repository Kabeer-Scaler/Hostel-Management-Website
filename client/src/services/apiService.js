import axios from 'axios';

// 1. DEFINE THE BASE URL
// This is the URL where your backend server is running
const API_URL = 'http://hostel-management-website-jkl3.onrender.com/api'; // Make sure this port matches your backend!

// 2. CREATE THE AXIOS INSTANCE
// We create a 'template' for all our API calls
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. IMPORTANT: ADD A REQUEST INTERCEPTOR
// This function will run *before* every single API request your frontend makes.
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from local storage (we'll save it there after login)
    const token = localStorage.getItem('token');

    if (token) {
      // If the token exists, add it to the 'Authorization' header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// 4. EXPORT YOUR API FUNCTIONS
// Now we create simple functions for our components to call.

// === Auth Routes ===
export const loginUser = (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

export const registerUser = (name, email, password) => {
  return apiClient.post('/auth/signup', { name, email, password });
};

// === User Routes ===
export const getMyProfile = () => {
  return apiClient.get('/users/me');
};

// === Room Routes ===
export const getAllRooms = () => {
    return apiClient.get('/rooms'); 
};

export const getAllMessOptions = () => {
  return apiClient.get('/mess/options');
};

export const getMyMonthlyMess = () => {
  // We don't need a controller for this, we can just add a route
  // that gets the mess record for req.user._id and the current month.
  // ...or we can just make the /users/me route return this.

  // Let's create a new route for this.
  return apiClient.get('/mess/me');
};

export const updateMyMonthlyMess = (optedIn, messTypeId) => {
  return apiClient.put('/mess/opt', { optedIn, messTypeId });
};

// (We'll add getComplaints, markAttendance, etc. here)
export const getMyComplaints = () => {
  return apiClient.get('/complaints/me');
};

export const createComplaint = (issue) => {
  return apiClient.post('/complaints', { issue });
};

export const getMyAttendance = () => {
  return apiClient.get('/attendance/me');
};

export const markAttendance = () => {
  return apiClient.post('/attendance/mark');
};

export const getAllUsers = () => {
  return apiClient.get('/users');
};

// --- Rooms ---
export const createRoom = (roomNumber, roomType) => {
  return apiClient.post('/rooms', { roomNumber, roomType });
};

export const assignStudentToRoom = (roomId, studentId) => {
  return apiClient.put(`/rooms/${roomId}/assign`, { studentId });
};

// --- Complaints ---
export const getAllComplaints = () => {
  return apiClient.get('/complaints/all');
};

export const updateComplaintStatus = (complaintId, status) => {
  return apiClient.put(`/complaints/${complaintId}`, { status });
};

// --- Mess (Admin) ---
export const createMessOption = (name, price, description) => {
  return apiClient.post('/mess/option', { name, price, description });
};

export const updateMessOption = (optionId, name, price, description) => {
  return apiClient.put(`/mess/option/${optionId}`, { name, price, description });
};

export const deleteMessOption = (optionId) => {
  return apiClient.delete(`/mess/option/${optionId}`);
};

export const getMessSummary = () => {
  return apiClient.get('/mess/summary');
};

// --- Attendance (Admin) ---
export const getAllAttendance = () => {
  return apiClient.get('/attendance/all');
};


// Default export (optional, but good practice)
export default apiClient;
