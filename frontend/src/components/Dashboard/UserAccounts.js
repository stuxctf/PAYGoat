import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import getUserAccounts from '../../services/getUserAccounts';

const UserAccounts = () => {
  const [accounts, setAccounts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getUserAccounts();
        setAccounts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <div className="bg-secondary p-5 rounded shadow text-center" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="mb-4">User Accounts</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {!error && !accounts && <div>Loading Accounts...</div>}

        {accounts && (
          <>
            <p><strong>Cuenta USD:</strong> {accounts.accountUSD}</p>
            <p><strong>Saldo USD:</strong> ${accounts.balanceUSD}</p>

            <p><strong>Cuenta EUR:</strong> {accounts.accountEUR}</p>
            <p><strong>Saldo EUR:</strong> €{accounts.balanceEUR}</p>

            <Link to="/main" className="btn btn-light mt-4">
              <i className="bi bi-arrow-left-circle me-2"></i>Back to Home Page
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default UserAccounts;
