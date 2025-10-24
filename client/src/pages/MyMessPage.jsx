import React, { useState, useEffect } from 'react';
import {
  getAllMessOptions,
  getMyMonthlyMess,
  updateMyMonthlyMess,
} from '../services/apiService.js';
import { Link } from 'react-router-dom';

const MyMessPage = () => {
  // 1. State for data
  const [messOptions, setMessOptions] = useState([]); // All available plans
  const [myMessRecord, setMyMessRecord] = useState(null); // User's current choice

  // 2. State for UI controls
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [selectedMessTypeId, setSelectedMessTypeId] = useState(null);

  // 3. State for UI feedback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // 4. Fetch initial data on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch in parallel
        const [optionsRes, recordRes] = await Promise.all([
          getAllMessOptions(),
          getMyMonthlyMess(),
        ]);

        setMessOptions(optionsRes.data);
        setMyMessRecord(recordRes.data);

        // Set the initial state of the controls
        setIsOptedIn(recordRes.data.optedIn);
        setSelectedMessTypeId(recordRes.data.messType?._id || null);

      } catch (err) {
        setError('Failed to load mess data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array = run once on load

  // 5. Handle the save button click
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Determine the final messType to send
      // If user is opting out, we must send null
      const finalMessTypeId = isOptedIn ? selectedMessTypeId : null;

      if (isOptedIn && !finalMessTypeId) {
        throw new Error('Please select a mess plan.');
      }

      // Call the API
      const response = await updateMyMonthlyMess(isOptedIn, finalMessTypeId);

      // Update our local state with the saved data
      setMyMessRecord(response.data);
      setSuccess('Your mess preferences have been updated!');

    } catch (err) {
      setError(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // 6. Handle the opt-in toggle
  const handleOptInToggle = (e) => {
    setIsOptedIn(e.target.checked);
    if (!e.target.checked) {
      // If user opts out, clear their selection
      setSelectedMessTypeId(null);
    }
  };

  // 7. Render logic
  if (loading) {
    return <div>Loading mess preferences...</div>;
  }

  return (
    <div className="mess-container">
      <h2>Manage My Mess</h2>
      <p>
        Current Month:{' '}
        <strong>
          {new Date().toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </strong>
      </p>

      <div className="mess-toggle-group">
        <label htmlFor="opt-in-toggle">Opt-in to mess services this month:</label>
        <input
          type="checkbox"
          id="opt-in-toggle"
          className="toggle-switch"
          checked={isOptedIn}
          onChange={handleOptInToggle}
        />
      </div>

      {/* Only show plans if user has opted in */}
      {isOptedIn && (
        <div className="mess-options-grid">
          <h3>Select Your Plan</h3>
          {messOptions.map((option) => (
            <div
              key={option._id}
              className={`mess-option-card ${
                selectedMessTypeId === option._id ? 'selected' : ''
              }`}
              onClick={() => setSelectedMessTypeId(option._id)}
            >
              <h4>{option.name}</h4>
              <p className="mess-price">₹{option.price} / month</p>
              <p>{option.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Save button and feedback messages */}
      <div className="mess-actions">
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>

      <Link to="/" className="back-link">
        &larr; Back to Dashboard
      </Link>
    </div>
  );
};

export default MyMessPage;