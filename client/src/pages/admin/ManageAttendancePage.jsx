import React, { useState, useEffect } from 'react';
import { getAllAttendance } from '../../services/apiService.js';
import { Link } from 'react-router-dom';

const ManageAttendancePage = () => {
  // 1. State for data
  const [attendance, setAttendance] = useState([]);

  // 2. State for UI feedback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Optional: Add state for filtering by date or user
  // const [filter, setFilter] = useState(""); 

  // 3. Fetch all data on load
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllAttendance();
      // Sort by most recent date first
      setAttendance(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError('Failed to load attendance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 4. Render logic
  if (loading) return <div>Loading all attendance records...</div>;

  return (
    <div className="admin-manage-container">
      <h2>View All Attendance</h2>
      <Link to="/admin" className="back-link">&larr; Back to Admin Dashboard</Link>

      {error && <p className="error-message">{error}</p>}

      {/* === List of All Attendance === */}
      <div className="admin-list-container">
        <h3>All Attendance Records</h3>
        {/* We can re-use the .attendance-list style from the student page */}
        <ul className="attendance-list">
          {attendance.length === 0 ? (
            <p>No attendance records found.</p>
          ) : (
            attendance.map((record) => (
              <li key={record._id}>
                {/* User Info */}
                <div>
                  <strong className="attendance-user-name">
                    {record.user?.name || 'Unknown User'}
                  </strong>
                  <span className="attendance-user-email">
                    {record.user?.email || 'N/A'}
                  </span>
                </div>

                {/* Date and Status Info */}
                <div>
                  <span className="attendance-date">
                    {new Date(record.date).toLocaleString()}
                  </span>
                  {/* We re-use the status badge styles */}
                  <span className={`status-badge status-${record.status}`}>
                    {record.status}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ManageAttendancePage;