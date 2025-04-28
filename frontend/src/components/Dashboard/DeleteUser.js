import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/Api';

const DeleteAccountProfile = () => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); 
  const navigate = useNavigate(); 

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');

    try {
      
      await api.delete(`/user/detele-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Account successfully deleted.');
      setError('');

      localStorage.removeItem('token');
      localStorage.removeItem('userID');

      
      navigate('/login'); 
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message); 
      } else {
        setError('Unknown error when deleting the account.');
      }
      setMessage('');
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <div className="bg-secondary p-5 rounded shadow text-center" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="mb-4">Delete Account</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!showConfirmDialog ? (
          <>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <button onClick={() => setShowConfirmDialog(true)} className="btn btn-danger w-100">
            Delete Account
            </button>
            <Link to="/main" className="btn btn-light mt-4">
              <i className="bi bi-arrow-left-circle me-2"></i>Back to Home Page
            </Link>
          </>
        ) : (
          <div>
            <p>Are you sure you want to delete your account?</p>
            <div>
              <button onClick={handleDeleteAccount} className="btn btn-danger me-2">
                Yes, delete account
              </button>
              <button onClick={handleCancel} className="btn btn-secondary">
                No, Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountProfile;
