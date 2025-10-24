import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

// Basic card component for styling
const InfoCard = ({ title, children }) => (
  <div className="info-card">
    <h3>{title}</h3>
    {children}
  </div>
);

const StudentDashboard = () => {
  const { user } = useAuth(); // Get user from our context

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.name}!</h2>

      <div className="card-grid">
        <InfoCard title="My Profile">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </InfoCard>

        <InfoCard title="My Room">
          {user.room ? (
            <>
              <p><strong>Room Number:</strong> {user.room.roomNumber}</p>
              <p><strong>Room Type:</strong> {user.room.roomType}</p>
            </>
          ) : (
            <p>You have not been assigned a room yet.</p>
          )}
        </InfoCard>

        <InfoCard title="Manage My Mess">
          <p>View and update your mess preferences for the month.</p>
          <Link to="/my-mess" className="card-link-button">
            Manage Mess
          </Link>
        </InfoCard>

        {/* We can add more cards here later */}
        <InfoCard title="My Complaints">
          <p>View or file a new complaint.</p>
          <Link to="/my-complaints" className="card-link-button">
            View Complaints
          </Link>
        </InfoCard>
        <InfoCard title="My Attendance">
  <p>Mark your attendance for today or view your history.</p>
  <Link to="/my-attendance" className="card-link-button">
    Mark Attendance
  </Link>
</InfoCard>
      </div>
    </div>
  );
};

export default StudentDashboard;