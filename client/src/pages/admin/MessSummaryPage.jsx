import React, { useState, useEffect } from 'react';
import { getMessSummary } from '../../services/apiService.js';
import { Link } from 'react-router-dom';

const MessSummaryPage = () => {
  // 1. State for data
  const [summary, setSummary] = useState(null);

  // 2. State for UI feedback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Get current month string
  const currentMonth = new Date().toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  // 4. Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getMessSummary();
        setSummary(response.data);
      } catch (err) {
        setError('Failed to load mess summary.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array = run once on load

  // 5. Render logic
  if (loading) return <div>Loading mess summary...</div>;

  return (
    <div className="admin-manage-container">
      <h2>Mess Summary - {currentMonth}</h2>
      <Link to="/admin" className="back-link">&larr; Back to Admin Dashboard</Link>

      {error && <p className="error-message">{error}</p>}

      {summary && (
        <div className="summary-container">
          <div className="summary-total-card">
            <h3>Total Revenue (This Month)</h3>
            <p>₹{summary.total.toLocaleString('en-IN')}</p>
          </div>

          <h3>Breakdown by Plan</h3>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Mess Plan</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary.summary).map(([planName, subtotal]) => (
                <tr key={planName}>
                  <td>{planName}</td>
                  <td>₹{subtotal.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MessSummaryPage;