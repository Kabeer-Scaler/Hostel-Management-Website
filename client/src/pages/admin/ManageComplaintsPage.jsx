import React, { useState, useEffect } from 'react';
import { getAllComplaints, updateComplaintStatus } from '../../services/apiService.js';
import { Link } from 'react-router-dom';

const ManageComplaintsPage = () => {
  // 1. State for data
  const [complaints, setComplaints] = useState([]);

  // 2. State for UI feedback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 3. Fetch all data on load
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllComplaints();
      // Sort by most recent first
      setComplaints(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 4. Handler for changing a complaint's status
  const handleStatusChange = async (complaintId, newStatus) => {
    setError(null);
    setSuccess(null);

    try {
      // Call the API
      await updateComplaintStatus(complaintId, newStatus);

      // Update the status in our local state
      setComplaints((prevComplaints) =>
        prevComplaints.map((c) =>
          c._id === complaintId ? { ...c, status: newStatus } : c
        )
      );

      setSuccess('Status updated successfully!');
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  if (loading) return <div>Loading all complaints...</div>;

  return (
    <div className="admin-manage-container">
      <h2>Manage Complaints</h2>
      <Link to="/admin" className="back-link">&larr; Back to Admin Dashboard</Link>

      {/* Feedback Messages */}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {/* === List of All Complaints === */}
      <div className="admin-list-container">
        <h3>All Student Complaints</h3>
        {complaints.length === 0 ? (
          <p>No complaints have been filed yet.</p>
        ) : (
          <div className="admin-complaints-list">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="complaint-card admin-complaint-card">
                <div className="complaint-header">
                  {/* We re-use the student's status badge styles */}
                  <span className={`status-badge status-${complaint.status.replace(' ', '-')}`}>
                    {complaint.status}
                  </span>
                  <span className="complaint-date">
                    {new Date(complaint.date).toLocaleString()}
                  </span>
                </div>

                {/* User and Room Info */}
                <div className="complaint-meta">
                  <p><strong>User:</strong> {complaint.user?.name || 'N/A'} ({complaint.user?.email || 'N/A'})</p>
                  {/* You might need to .populate('room') on the backend to show this */}
                  {/* <p><strong>Room:</strong> {complaint.room?.roomNumber || 'N/A'}</p> */}
                </div>

                <p className="complaint-issue">{complaint.issue}</p>

                {/* Admin Action: Change Status */}
                <div className="admin-complaint-actions">
                  <label htmlFor={`status-${complaint._id}`}>Change Status:</label>
                  <select
                    id={`status-${complaint._id}`}
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageComplaintsPage;