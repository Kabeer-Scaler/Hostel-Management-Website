import React, { useState, useEffect } from 'react';
import {
  getAllMessOptions,
  createMessOption,
  updateMessOption,
  deleteMessOption,
} from '../../services/apiService.js';
import { Link } from 'react-router-dom';

// Initial state for a new, blank form
const blankForm = {
  name: '',
  price: '',
  description: '',
};

const ManageMessPage = () => {
  // 1. Data state
  const [messOptions, setMessOptions] = useState([]);

  // 2. Form state
  const [formData, setFormData] = useState(blankForm);
  const [editingId, setEditingId] = useState(null); // null = Creating, (id) = Editing

  // 3. UI feedback state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 4. Fetch all data on load
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllMessOptions();
      setMessOptions(response.data);
    } catch (err) {
      setError('Failed to load mess options.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 5. Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 6. Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { name, price, description } = formData;
    if (!name || !price) {
      setError('Name and Price are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        // --- UPDATE (EDIT) ---
        await updateMessOption(editingId, name, price, description);
      } else {
        // --- CREATE ---
        await createMessOption(name, price, description);
      }

      await fetchData(); // Refresh the list
      setFormData(blankForm); // Clear the form
      setEditingId(null); // Reset to create mode

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save option.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. Handle clicking the "Edit" button on an item
  const handleEditClick = (option) => {
    setEditingId(option._id);
    setFormData({
      name: option.name,
      price: option.price,
      description: option.description || '',
    });
    setError(null);
  };

  // 8. Handle canceling an edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(blankForm);
    setError(null);
  };

  // 9. Handle deleting an item
  const handleDeleteClick = async (optionId) => {
    if (window.confirm('Are you sure you want to delete this option?')) {
      try {
        await deleteMessOption(optionId);
        await fetchData(); // Refresh the list
      } catch (err) {
        setError('Failed to delete option.');
      }
    }
  };

  if (loading) return <div>Loading mess plans...</div>;

  return (
    <div className="admin-manage-container">
      <h2>Manage Mess Plans</h2>
      <Link to="/admin" className="back-link">&larr; Back to Admin Dashboard</Link>

      {/* === Create/Edit Form === */}
      {/* We reuse the admin form card style from the rooms page */}
      <form onSubmit={handleSubmit} className="admin-form-card">
        <h3>{editingId ? 'Edit Mess Plan' : 'Create New Mess Plan'}</h3>

        <div className="form-group">
          <label htmlFor="name">Plan Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="E.g., Standard Veg"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (per month)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="E.g., 3500"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="E.g., Basic daily meals."
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-button-group">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (editingId ? 'Update Plan' : 'Create Plan')}
          </button>
          {editingId && (
            <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* === List of Existing Mess Plans === */}
      <div className="admin-list-container">
        <h3>All Mess Plans</h3>
        {messOptions.length === 0 ? (
          <p>No mess plans created yet.</p>
        ) : (
          <div className="admin-mess-list">
            {messOptions.map((option) => (
              <div key={option._id} className="mess-option-item">
                <div className="mess-option-info">
                  <strong>{option.name}</strong> (₹{option.price})
                  <p>{option.description}</p>
                </div>
                <div className="mess-option-actions">
                  <button className="edit-btn" onClick={() => handleEditClick(option)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteClick(option._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMessPage;