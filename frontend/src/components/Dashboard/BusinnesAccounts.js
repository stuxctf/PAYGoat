import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/Api';

const BusinessAccounts = () => {
  const [company, setCompany] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem('token');
      const companyID = localStorage.getItem('companyID');

      if (!token || !companyID) {
        setError('User session or company ID not found.');
        return;
      }

      try {
        const response = await api.post(
          '/business/accounts',
          { companyID },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCompany(response.data);
      } catch (err) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Error fetching business accounts.');
        }
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <div className="bg-secondary p-5 rounded shadow text-center" style={{ maxWidth: '700px', width: '100%' }}>
        <h2 className="mb-4">Business Accounts</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {!error && !company && <div>Loading accounts...</div>}

        {company && (
          <div className="mb-4 text-start">
            <h4>{company.companyName}</h4>
            <p><strong>Number of Accounts:</strong> {company.accounts.length}</p>

            <table className="table table-dark table-bordered mb-3">
              <thead>
                <tr>
                  <th>Account Number</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {company.accounts.map((acc, idx) => (
                  <tr key={idx}>
                    <td>{acc.accountNumber}</td>
                    <td>{acc.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link to="/main" className="btn btn-light mt-4">
          <i className="bi bi-arrow-left-circle me-2"></i>Back to Home Page
        </Link>
      </div>
    </div>
  );
};

export default BusinessAccounts;
