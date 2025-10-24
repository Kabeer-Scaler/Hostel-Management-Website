import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const Layout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-content">
        {/* This Outlet renders the active child route */}
        {/* (e.g., StudentDashboard, AdminDashboard, etc.) */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;