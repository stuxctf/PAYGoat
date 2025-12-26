import React, { useState } from 'react';
import api from '../../services/Api';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
        isBusiness
      });

      const {
        token,
        userID,
        userType,
        companyID,
        role,
        businessUserID
      } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);

      if (businessUserID) {
        localStorage.setItem('businessUserID', businessUserID);
      } else {
        localStorage.setItem('userID', userID);
      }

      if (companyID !== null) {
        localStorage.setItem('companyID', companyID);
        localStorage.setItem('role', role);
      } else {
        localStorage.removeItem('companyID');
        localStorage.removeItem('role');
      }

      window.location.href = '/main';

    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <form
        onSubmit={handleLogin}
        className="bg-secondary p-4 rounded shadow"
        style={{ width: '300%', maxWidth: '500px' }}
      >
        <h2 className="text-center mb-4">PAYGOAT BANK</h2>

        {error && (
          <div className="alert alert-danger text-center py-2">
            {error}
          </div>
        )}

        <div className="input-group mb-3">
          <span className="input-group-text bg-white border-0 rounded-start">
            <i className="bi bi-person-fill"></i>
          </span>
          <input
            type="text"
            className="form-control border-0"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group mb-4">
          <input
            type="password"
            className="form-control border-0"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="input-group-text bg-white border-0 rounded-end">
            <i className="bi bi-lock-fill"></i>
          </span>
        </div>

        {/* CHECK EMPRESARIAL */}
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="businessLogin"
            checked={isBusiness}
            onChange={(e) => setIsBusiness(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="businessLogin">
            Login empresarial
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-light w-100 fw-bold"
          disabled={loading}
        >
          {loading ? 'Authenticating...' : 'LOGIN'}
        </button>

        <div className="d-flex justify-content-between mt-3">
          <Link to="/forgot-password" className="text-white">
            Forgot Password?
          </Link>
          <Link to="/register" className="text-white">
            Register
          </Link>
        </div>

        <div className="text-center mt-3 text-muted small">
          PAYGOAT Banking Platform
        </div>
      </form>
    </div>
  );
};

export default Login;
