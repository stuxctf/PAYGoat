import React, { useState } from 'react';
import api from '../../services/Api';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await api.post('/auth/login', { username, password });
  
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userID', response.data.userID);
  
      window.location.href = '/main';
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Ocurrió un error al iniciar sesión');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <form onSubmit={handleLogin} className="bg-secondary p-4 rounded shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">BANK LOGIN</h2>

        {error && (
          <div className="alert alert-danger text-center py-2">{error}</div>
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

        <button type="submit" className="btn btn-light w-100 fw-bold">LOGIN</button>

        <div className="d-flex justify-content-between mt-3">
          <Link to="/forgot-password" className="text-white">Forgot Password?</Link>
          <Link to="/register" className="text-white">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
