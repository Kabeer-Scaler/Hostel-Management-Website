import React, { useState, useEffect, useMemo } from 'react';
import {
  getAllRooms,
  getAllUsers,
  createRoom,
  assignStudentToRoom,
} from '../../services/apiService.js';
import { Link } from 'react-router-dom';

const ManageRoomsPage = () => {
  // 1. Data state
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);

  // 2. Form state for creating a room
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomType, setNewRoomType] = useState('Double-Sharing');

  // 3. Form state for assigning a student
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // 4. UI feedback state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // 5. Fetch all data on load
  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsRes, usersRes] = await Promise.all([
        getAllRooms(),
        getAllUsers(),
      ]);
      setRooms(roomsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 6. Memoized list of unassigned students
  // This recalculates only when 'users' changes
  const unassignedStudents = useMemo(() => {
    return users.filter(
      (user) => user.role === 'student' && !user.room
    );
  }, [users]);

  // 7. Handler for creating a room
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomNumber) return setError('Room number is required.');

    setIsCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await createRoom(newRoomNumber, newRoomType);
      setRooms([...rooms, response.data]); // Add new room to the list
      setNewRoomNumber(''); // Clear form
      setSuccess('Room created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room.');
    } finally {
      setIsCreating(false);
    }
  };

  // 8. Handler for assigning a student
  const handleAssignStudent = async (e) => {
    e.preventDefault();
    if (!selectedRoomId || !selectedStudentId) {
      return setError('You must select a room and a student.');
    }

    setIsAssigning(true);
    setError(null);
    setSuccess(null);

    try {
      await assignStudentToRoom(selectedRoomId, selectedStudentId);
      // Refresh all data to show changes
      fetchData();
      setSelectedRoomId(''); // Clear forms
      setSelectedStudentId('');
      setSuccess('Student assigned successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign student.');
    } finally {
      setIsAssigning(false);
    }
  };

  if (loading) return <div>Loading room and user data...</div>;

  return (
    <div className="admin-manage-container">
      <h2>Manage Rooms</h2>
      <Link to="/admin" className="back-link">&larr; Back to Admin Dashboard</Link>

      {/* Feedback Messages */}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="admin-forms-grid">
        {/* === Create Room Form === */}
        <form onSubmit={handleCreateRoom} className="admin-form-card">
          <h3>Create New Room</h3>
          <div className="form-group">
            <label htmlFor="roomNumber">Room Number</label>
            <input
              type="text"
              id="roomNumber"
              value={newRoomNumber}
              onChange={(e) => setNewRoomNumber(e.target.value)}
              placeholder="E.g., A-101"
            />
          </div>
          <div className="form-group">
            <label htmlFor="roomType">Room Type</label>
            <select
              id="roomType"
              value={newRoomType}
              onChange={(e) => setNewRoomType(e.target.value)}
            >
              <option value="Double-Sharing">Double-Sharing</option>
              <option value="Triple-Sharing">Triple-Sharing</option>
            </select>
          </div>
          <button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Room'}
          </button>
        </form>

        {/* === Assign Student Form === */}
        <form onSubmit={handleAssignStudent} className="admin-form-card">
          <h3>Assign Student to Room</h3>
          <div className="form-group">
            <label htmlFor="student">Select Student (Unassigned)</label>
            <select
              id="student"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              <option value="">-- Select a student --</option>
              {unassignedStudents.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="room">Select Room</label>
            <select
              id="room"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
            >
              <option value="">-- Select a room --</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.roomNumber} ({room.roomType})
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={isAssigning}>
            {isAssigning ? 'Assigning...' : 'Assign Student'}
          </button>
        </form>
      </div>

      {/* === List of All Rooms === */}
      <div className="admin-list-container">
        <h3>All Rooms</h3>
        {rooms.length === 0 ? (
          <p>No rooms created yet.</p>
        ) : (
          <div className="card-grid">
            {rooms.map((room) => (
              <div key={room._id} className="info-card">
                <h3>{room.roomNumber}</h3>
                <p><strong>Type:</strong> {room.roomType}</p>
                <p><strong>Members:</strong> {room.roomMembers?.length || 0}</p>
                {/* We can improve this list later */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRoomsPage;