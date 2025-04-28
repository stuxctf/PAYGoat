import React, { useEffect, useState } from 'react';
import api from '../../services/Api';
import getUserAccounts from '../../services/getUserAccounts';
import { Link } from 'react-router-dom';

const TransactionHistory = () => {
  const [accounts, setAccounts] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10); 

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

  const handleAccountChange = async (e) => {
    const account = e.target.value;
    setSelectedAccount(account);

    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/bank/transactions/history?account=${account}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(response.data.transactions);
      setError('');
    } catch (err) {
      console.error(err);
      setTransactions([]);
      setError(err.response?.data?.message || 'Error in obtaining the history.');
    }
  };

  
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <div className="bg-secondary p-5 rounded shadow text-center" style={{ maxWidth: '700px', width: '100%' }}>
        <h2 className="mb-4">Movement History</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {!accounts && !error && <div>Loading accounts...</div>}

        {accounts && (
          <>
            <div className="mb-4">
              <label htmlFor="accountSelect" className="form-label">Select an account:</label>
              <select
                id="accountSelect"
                className="form-select"
                value={selectedAccount}
                onChange={handleAccountChange}
              >
                <option value="">-- Selecciona una cuenta --</option>
                <option value={accounts.accountUSD}>{accounts.accountUSD} (USD)</option>
                <option value={accounts.accountEUR}>{accounts.accountEUR} (EUR)</option>
              </select>
            </div>

            {currentTransactions.length > 0 ? (
              <table className="table table-dark table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Emisor</th>
                    <th>Receptor</th>
                    <th>Monto</th>
                    <th>Moneda</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map(tx => (
                    <tr key={tx.transactionID}>
                      <td>{tx.transactionID}</td>
                      <td>{tx.senderAccount}</td>
                      <td>{tx.recipientAccount}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.currencyFrom} ➝ {tx.currencyTo}</td>
                      <td>{new Date(tx.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : selectedAccount && <div>There are no transactions for this account</div>}

            {/* Paginación */}
            <div className="mt-4">
              <nav>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                      Anterior
                    </button>
                  </li>
                  {[...Array(totalPages).keys()].map(number => (
                    <li
                      key={number + 1}
                      className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                    >
                      <button className="page-link" onClick={() => paginate(number + 1)}>
                        {number + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                      Siguiente
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}

        <Link to="/main" className="btn btn-light mt-4">
          <i className="bi bi-arrow-left-circle me-2"></i>Back to Home Page
        </Link>
      </div>
    </div>
  );
};

export default TransactionHistory;
