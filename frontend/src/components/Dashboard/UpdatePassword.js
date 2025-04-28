import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/Api';

const UpdatePasswordProfile = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    const userID = localStorage.getItem('userID');
    const token = localStorage.getItem('token');
    
    if (!token || !userID) {
      setError('The users session was not found.');
      return;
    }
    
    try {
      await api.put(`/user/profile/${userID}/password`, 
        { password }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Password updated successfully.');
      setError('');
      setPassword('');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        
        setError('Unknown error when updating the password.');
      }
      setMessage('');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <div className="bg-secondary p-5 rounded shadow text-center" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="mb-4">Update Password</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleUpdate}>
          <div className="mb-3 text-start">
            <label className="form-label">Enter the new password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-light w-100">
            Save Changes
          </button>
        </form>
        <Link to="/main" className="btn btn-light mt-4">
          <i className="bi bi-arrow-left-circle me-2"></i>Back to Home Page
        </Link>
      </div>
    </div>
  );
};

export default UpdatePasswordProfile;
