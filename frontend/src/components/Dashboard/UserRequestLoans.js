import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/Api';

const LoanRequest = () => {
  const [formData, setFormData] = useState({
    amount: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');

    if (!token || !userID) {
      setError('The users session was not found.');
      setLoading(false);
      return;
    }

    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        userID: parseInt(userID),
        amount: parseFloat(formData.amount)
      };

      const response = await api.post('/bank/loan/request', requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setSuccess('Loan requested successfully!');
        setTimeout(() => navigate('/main'), 2000);
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 400) {
        setError('Incomplete data or disallowed amount');
      } else if (err.response?.status === 403) {
        setError('You already have the maximum number of allowed loans');
      } else {
        setError('Error requesting the loan');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <div className="bg-secondary p-5 rounded shadow" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="mb-4 text-center">Request Loan</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Loan amount (USD)</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                id="amount"
                name="amount"
                min="100"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-text">Min $100 USD and Max $500</div>
          </div>

          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : 'Solicitar Préstamo'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link to="/main" className="btn btn-light">
            <i className="bi bi-arrow-left-circle me-2"></i>Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoanRequest;