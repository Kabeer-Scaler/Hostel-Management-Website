import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Page Components
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import MyMessPage from './pages/MyMessPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import MyComplaintsPage from './pages/MyComplaintsPage.jsx';
import MyAttendancePage from './pages/MyAttendancePage.jsx';

import ManageRoomsPage from './pages/admin/ManageRoomsPage.jsx';
import ManageComplaintsPage from './pages/admin/ManageComplaintsPage.jsx';
import ManageMessPage from './pages/admin/ManageMessPage.jsx';
import ManageAttendancePage from './pages/admin/ManageAttendancePage.jsx';
import MessSummaryPage from './pages/admin/MessSummaryPage.jsx';

// Import Route Protection Components
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';



function App() {
  return (
    <Routes>
      {/* This is a basic setup.
        For a real app, you'd add a <Layout /> component here
        to show a Navbar on every page.
      */}

      {/* === PUBLIC ROUTES === */}
      {/* These are visible to everyone */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* === STUDENT PROTECTED ROUTES === */}
      {/* These are only for logged-in users (students OR admins) */}
      <Route element={<Layout />}>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/my-mess" element={<MyMessPage />} />
        <Route path="/my-complaints" element={<MyComplaintsPage />} />
        <Route path="/my-attendance" element={<MyAttendancePage />} />
        {/* Add your other student routes here */}
        {/* <Route path="/my-complaints" element={<MyComplaintsPage />} /> */}
        {/* <Route path="/my-attendance" element={<AttendancePage />} /> */}
        {/* <Route path="/my-mess" element={<MessPage />} /> */}
      </Route>
      </Route>
      
      {/* === ADMIN PROTECTED ROUTES === */}
      {/* These are ONLY for users with role: 'admin' */}
      <Route element={<Layout />}>
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/rooms" element={<ManageRoomsPage />} />
          <Route path="/admin/complaints" element={<ManageComplaintsPage />} />
          <Route path="/admin/mess" element={<ManageMessPage />} />
          <Route path="/admin/attendance" element={<ManageAttendancePage />} />
          <Route path="/admin/mess-summary" element={<MessSummaryPage />} />
        {/* Add your other admin routes here */}
        {/* <Route path="/manage-rooms" element={<ManageRoomsPage />} /> */}
        {/* <Route path="/all-complaints" element={<AllComplaintsPage />} /> */}
      </Route>
      </Route>

      {/* === CATCH ALL (404) ROUTE === */}
      {/* This must be the last route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
