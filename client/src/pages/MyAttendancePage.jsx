import React, { useState, useEffect } from 'react';
import { getMyAttendance, markAttendance } from '../services/apiService.js';
import { Link } from 'react-router-dom';

const MyAttendancePage = () => {
  // 1. State for data
  const [attendance, setAttendance] = useState([]);
  const [hasMarkedToday, setHasMarkedToday] = useState(false);

  // 2. State for UI feedback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Helper function to check today's attendance
  const checkIfMarkedToday = (records) => {
    const today = new Date().toLocaleDateString();
    return records.some(
      (record) => new Date(record.date).toLocaleDateString() === today
    );
  };

  // 4. Fetch all attendance on page load
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await getMyAttendance();
        const sortedRecords = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setAttendance(sortedRecords);
        setHasMarkedToday(checkIfMarkedToday(sortedRecords));
      } catch (err) {
        setError('Failed to fetch attendance.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []); // Empty array = run once on load

  // 5. Handle the "Mark Attendance" button click
  const handleMarkAttendance = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await markAttendance();
      // Add the new record to the top of our list
      setAttendance([response.data.attendance, ...attendance]);
      setHasMarkedToday(true); // Disable the button
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to mark attendance.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="attendance-container">
      <h2>My Attendance</h2>

      {/* === Mark Attendance Section === */}
      <div className="mark-attendance-box">
        <h3>Today's Date: {new Date().toLocaleDateString()}</h3>
        {loading ? (
          <p>Checking status...</p>
        ) : hasMarkedToday ? (
          <p className="success-message">
            Your attendance is marked for today.
          </p>
        ) : (
          <button onClick={handleMarkAttendance} disabled={isSubmitting}>
            {isSubmitting ? 'Marking...' : 'Mark My Attendance'}
          </button>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* === Attendance History === */}
      <div className="attendance-history">
        <h3>My Attendance History</h3>
        {loading ? (
          <p>Loading history...</p>
        ) : attendance.length === 0 ? (
          <p>You have no attendance records yet.</p>
        ) : (
          <ul className="attendance-list">
            {attendance.map((record) => (
              <li key={record._id}>
                <span className="attendance-date">
                  {new Date(record.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="status-badge status-Present">
                  {record.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link to="/" className="back-link">
        &larr; Back to Dashboard
      </Link>
    </div>
  );
};

export default MyAttendancePage;