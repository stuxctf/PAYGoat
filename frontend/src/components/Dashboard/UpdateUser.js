import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/Api';


const UpdateProfile = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    const userID = localStorage.getItem('userID');
    const token = localStorage.getItem('token');

    if (!userID || !token) {
      setError('The users session was not found.');
      return;
    }

    try {
      await api.put(`/user/profile/${userID}`, {
        firstname,
        lastname,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('Profile successfully updated.');
      setError('');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Profile update failed.');
      }
      setMessage('');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <div className="bg-secondary p-5 rounded shadow text-center" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="mb-4">Updated Profile</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleUpdate}>
          <div className="mb-3 text-start">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 text-start">
            <label className="form-label">Lastname</label>
            <input
              type="text"
              className="form-control"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
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

export default UpdateProfile;
