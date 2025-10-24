import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// We can re-use the InfoCard from the student dashboard
// A better approach would be to move InfoCard to its own file
// in /components, but for now, we can just copy it.

const InfoCard = ({ title, children }) => (
  <div className="info-card">
    <h3>{title}</h3>
    {children}
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user?.name}. Manage all hostel operations from here.</p>

      <div className="card-grid">
        <InfoCard title="Manage Rooms">
          <p>Create new rooms and assign students.</p>
          <Link to="/admin/rooms" className="card-link-button">
            Manage Rooms
          </Link>
        </InfoCard>

        <InfoCard title="Manage Complaints">
          <p>View and resolve student complaints.</p>
          <Link to="/admin/complaints" className="card-link-button">
            View Complaints
          </Link>
        </InfoCard>

        <InfoCard title="Manage Mess">
          <p>Create, edit, or delete mess plans for the month.</p>
          <Link to="/admin/mess" className="card-link-button">
            Manage Mess Plans
          </Link>
        </InfoCard>

        <InfoCard title="View Attendance">
          <p>See a complete log of all student attendance.</p>
          <Link to="/admin/attendance" className="card-link-button">
            View Attendance
          </Link>
        </InfoCard>

        <InfoCard title="View Mess Summary">
          <p>See a summary of this month's mess bill.</p>
          <Link to="/admin/mess-summary" className="card-link-button">
            View Summary
          </Link>
        </InfoCard>
      </div>
    </div>
  );
};

export default AdminDashboard;