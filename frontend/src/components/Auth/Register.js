import React, { useState } from 'react';
import api from '../../services/Api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');

  const [registerCompany, setRegisterCompany] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [taxID, setTaxID] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (registerCompany && (!companyName || !taxID)) {
      return setError('Company information is required.');
    }

    try {
      const payload = {
        username,
        firstname,
        lastname,
        password,
        userType: registerCompany ? 2 : 1
      };

      if (registerCompany) {
        payload.company = {
          companyName,
          taxID
        };
      }

      const response = await api.post('/auth/register', payload);

      if (response.status === 201) {
        setSuccess(true);

        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error) {
      console.error('Error during registration.', error);

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Error during registration. Please try again.');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <form
        onSubmit={handleRegister}
        className="bg-secondary p-4 rounded shadow"
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <h2 className="text-center mb-4">REGISTER</h2>

        {error && (
          <div className="alert alert-danger text-center py-2">{error}</div>
        )}

        {success && (
          <div className="alert alert-success text-center py-2">
            Successful registration. Redirecting...
          </div>
        )}

        {/* USER FIELDS */}
        <div className="input-group mb-3">
          <span className="input-group-text bg-white border-0">
            <i className="bi bi-person-circle"></i>
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

        <div className="input-group mb-3">
          <span className="input-group-text bg-white border-0">
            <i className="bi bi-person-badge-fill"></i>
          </span>
          <input
            type="text"
            className="form-control border-0"
            placeholder="Firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text bg-white border-0">
            <i className="bi bi-person-lines-fill"></i>
          </span>
          <input
            type="text"
            className="form-control border-0"
            placeholder="Lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
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
          <span className="input-group-text bg-white border-0">
            <i className="bi bi-lock-fill"></i>
          </span>
        </div>

        {/* REGISTER COMPANY SWITCH */}
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={registerCompany}
            onChange={(e) => setRegisterCompany(e.target.checked)}
          />
          <label className="form-check-label">
            Register as company
          </label>
        </div>

        {/* COMPANY FIELDS */}
        {registerCompany && (
          <>
            <hr className="text-light" />
            <h6 className="text-center mb-3">Company Information</h6>

            <div className="input-group mb-3">
              <span className="input-group-text bg-white border-0">
                <i className="bi bi-building"></i>
              </span>
              <input
                type="text"
                className="form-control border-0"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="input-group mb-4">
              <span className="input-group-text bg-white border-0">
                <i className="bi bi-file-earmark-text"></i>
              </span>
              <input
                type="text"
                className="form-control border-0"
                placeholder="Tax ID"
                value={taxID}
                onChange={(e) => setTaxID(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-light w-100 fw-bold">
          REGISTER
        </button>
      </form>
    </div>
  );
};

export default Register;
