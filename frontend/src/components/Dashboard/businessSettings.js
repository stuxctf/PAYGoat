import React, { useState } from 'react';
import api from '../../services/Api';

const CompanySettings = () => {
  const [companyName, setCompanyName] = useState('');
  const [newOwnerID, setNewOwnerID] = useState('');

  const companyID = localStorage.getItem('companyID');

  const updateCompany = async () => {
    await api.post('/business/settings/update', {
      companyID,
      companyName,
      newOwnerID
    });
    alert('Company updated');
  };

  const deleteCompany = async () => {
    await api.post('/business/settings/delete', { companyID });
    alert('Company deleted');
  };

  return (
    <div className="container text-white mt-4">
      <h3>Company Settings</h3>

      <div className="mb-3">
        <label>Company Name</label>
        <input
          className="form-control"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Change Owner (UserID)</label>
        <input
          className="form-control"
          value={newOwnerID}
          onChange={e => setNewOwnerID(e.target.value)}
        />
      </div>

      <button className="btn btn-warning me-2" onClick={updateCompany}>
        Update Company
      </button>

      <button className="btn btn-danger" onClick={deleteCompany}>
        Delete Company
      </button>
    </div>
  );
};

export default CompanySettings;
