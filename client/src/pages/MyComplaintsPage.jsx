import React, { useState, useEffect } from 'react';
import { getMyComplaints, createComplaint } from '../services/apiService.js';
import { Link } from 'react-router-dom';

const MyComplaintsPage = () => {
  // 1. State for data
  const [complaints, setComplaints] = useState([]);
  const [issue, setIssue] = useState(''); // For the new complaint form

  // 2. State for UI feedback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Fetch all complaints on page load
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await getMyComplaints();
        // Sort by most recent first
        setComplaints(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (err) {
        setError('Failed to fetch complaints.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []); // Empty array = run once on load

  // 4. Handle new complaint submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issue.trim()) {
      setError('Complaint cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Call the API
      const response = await createComplaint(issue);

      // Add the new complaint to the top of the list
      setComplaints([response.data, ...complaints]);
      setIssue(''); // Clear the form
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
    // Show the specific error from the backend
    setError(err.response.data.message);
  } else {
    // Show the generic error
    setError('Failed to submit complaint. Please try again.');
  }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Render logic
  return (
    <div className="complaints-container">
      <h2>My Complaints</h2>

      {/* === New Complaint Form === */}
      <form onSubmit={handleSubmit} className="complaint-form">
        <h3>File a New Complaint</h3>
        <p>Describe your issue, and an admin will review it.</p>
        <textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="E.g., The Wi-Fi in room B-102 is not working..."
          rows="4"
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>

      {/* === List of Past Complaints === */}
      <div className="complaints-list">
        <h3>My Complaint History</h3>
        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p>You have not filed any complaints yet.</p>
        ) : (
          complaints.map((complaint) => (
            <div key={complaint._id} className="complaint-card">
              <div className="complaint-header">
                <span className={`status-badge status-${complaint.status.replace(' ', '-')}`}>
                  {complaint.status}
                </span>
                <span className="complaint-date">
                  {new Date(complaint.date).toLocaleDateString()}
                </span>
              </div>
              <p className="complaint-issue">{complaint.issue}</p>
            </div>
          ))
        )}
      </div>

      <Link to="/" className="back-link">
        &larr; Back to Dashboard
      </Link>
    </div>
  );
};

export default MyComplaintsPage;