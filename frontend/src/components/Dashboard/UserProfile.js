import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/Api';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const userID = localStorage.getItem('userID');

      if (!token || !userID) {
        setError('The users session was not found.');
        return;
      }

      try {
        const response = await api.get(`/user/profile/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Error obtaining the users profile.');
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <div className="bg-secondary p-5 rounded shadow text-center" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="mb-4">User Profile</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {!error && !user && <div>Loading profile...</div>}

        {!error && user && (
          <>
            <p><strong>Usuario:</strong> {user.username}</p>
            <p><strong>Nombre:</strong> {user.firstname}</p>
            <p><strong>Apellido:</strong> {user.lastname}</p>          
            <p><strong>Celular:</strong> {user.phoneNumber}</p>

            <Link to="/main" className="btn btn-light mt-4">
              <i className="bi bi-arrow-left-circle me-2"></i>Back to Home Page
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
