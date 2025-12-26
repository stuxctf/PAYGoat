import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/Api';

const CompanySettings = () => {
  const companyID = localStorage.getItem('companyID');

  const [companyName, setCompanyName] = useState('');
  const [limitUSD, setLimitUSD] = useState(10000);
  const [allowOverdraft, setAllowOverdraft] = useState(false);

  const saveSettings = async () => {
    try {
      await api.post('/business/settings/update', {
        companyID,
        companyName,
        limitUSD,
        allowOverdraft
      });

      alert('Settings updated');
    } catch (err) {
      alert(err.response?.data?.error || 'Error updating settings');
    }
  };

  const deleteCompany = async () => {
    try {
      await api.delete(`/business/company/delete/${companyID}`);

      alert('Company deleted');
      localStorage.clear();
      window.location.href = '/login';
    } catch (err) {
      alert(err.response?.data?.error || 'Error deleting company');
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-dark text-white">

      <div
        className="bg-secondary p-4 rounded shadow"
        style={{ width: '100%', maxWidth: '500px' }}
      >
        <h3 className="text-center mb-4">
          <i className="bi bi-building me-2"></i>
          Company Settings
        </h3>

        <label>Company Name</label>
        <input
          className="form-control mb-3"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
        />

        <label>Daily Transfer Limit (USD)</label>
        <input
          type="number"
          className="form-control mb-3"
          value={limitUSD}
          onChange={e => setLimitUSD(e.target.value)}
        />

        <div className="form-check mb-4">
          <input
            type="checkbox"
            className="form-check-input"
            checked={allowOverdraft}
            onChange={() => setAllowOverdraft(!allowOverdraft)}
          />
          <label className="form-check-label">
            Allow Overdraft
          </label>
        </div>

        <button
          onClick={saveSettings}
          className="btn btn-light w-100 fw-bold mb-2"
        >
          Save Settings
        </button>

        <button
          onClick={deleteCompany}
          className="btn btn-danger w-100"
        >
          Delete Company
        </button>
      </div>

      <div className="alert alert-warning mt-4 text-center" style={{ maxWidth: '500px' }}>
        ⚠ Changes are applied immediately.
      </div>

      <Link to="/main" className="btn btn-light mt-3">
        <i className="bi bi-arrow-left-circle me-2"></i>
        Back to Home Page
      </Link>
    </div>
  );
};

export default CompanySettings;
