import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/Api';

const UserLoans = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLoans = async () => {
      const token = localStorage.getItem('token');
      const userID = localStorage.getItem('userID');

      if (!token || !userID) {
        setError('The users session was not found.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/bank/loan/user?userID=${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoans(response.data.loans || []);
      } catch (err) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Error getting credits from the user.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserLoans();
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <div className="bg-secondary p-5 rounded shadow" style={{ maxWidth: '800px', width: '100%' }}>
        <h2 className="mb-4 text-center">My Loans</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading && <div className="text-center">Loading Loans...</div>}

        {!loading && !error && loans.length === 0 && (
          <div className="alert alert-info">You don't have any loans on file</div>
        )}

        {!loading && !error && loans.length > 0 && (
          <>
            <div className="table-responsive">
              <table className="table table-dark table-striped">
                <thead>
                  <tr>
                    <th>Loan</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.loanID}>
                      <td>{loan.loanID}</td>
                      <td>${loan.amount.toFixed(2)}</td>
                      <td className={`text-${loan.status === 'approved' ? 'success' : 'warning'}`}>
                        {loan.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                      </td>
                      <td>{new Date(loan.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center mt-4">
              <Link to="/main" className="btn btn-light">
                <i className="bi bi-arrow-left-circle me-2"></i>Back to Home Page
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserLoans;