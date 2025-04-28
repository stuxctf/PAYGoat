import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/Api';


const TransferSectionUUID = () => {
  const [recipients, setRecipients] = useState([]);
  const [alias, setAlias] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountUSD, setAccountUSD] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const userID = localStorage.getItem('userID');
  const token = localStorage.getItem('token');

  const fetchRecipients = async () => {
    try {
      const response = await api.get(`/payment/saved-recipients?userID=${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecipients(response.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to get recipients.';
      setMessage(errorMessage);
    }
  };
  
  useEffect(() => {
    fetchRecipients();
  }, []);

  const handleAddRecipient = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payment/register-alias', {
        alias,
        accountNumber,
        userID,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Account successfully added.');
      setAlias('');
      setAccountNumber('');
      setShowAddForm(false);
      await fetchRecipients();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error adding account.';
      setMessage(errorMessage);
    }
  };
  
  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payment/transferFundsUuid', {
        accountUSD,
        recipientUUID: selectedRecipient,
        amount: parseFloat(amount),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Transfer successfully.');
      setAmount('');
      setAccountUSD('');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Transfer Error');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <div className="bg-secondary p-5 rounded shadow text-center" style={{ maxWidth: '700px', width: '100%' }}>
        <h2 className="mb-4">Transfers Section</h2>

        {message && <div className="alert alert-info">{message}</div>}

        {recipients.length === 0 && !showAddForm && (
          <div className="text-white">
            <p>No tienes cuentas guardadas.</p>
            <button className="btn btn-light" onClick={() => setShowAddForm(true)}>
              Add New Account
            </button>
          </div>
        )}

        {showAddForm && (
          <div className="mt-4 text-start">
            <h5 className="text-white">Add New Account</h5>
            <form onSubmit={handleAddRecipient}>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Alias"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Número de Cuenta"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-success">Save</button>
                <button type="button" className="btn btn-outline-light" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {recipients.length > 0 && !showAddForm && (
          <div className="mt-4 text-start">
            <h5 className="text-white">Transfer to a saved account</h5>
            <form onSubmit={handleTransfer}>
              <div className="mb-2">
                <select
                  className="form-select"
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  required
                >
                  <option value="">-- Select an account --</option>
                  {recipients.map((rec) => (
                    <option key={rec.uuid} value={rec.uuid}>
                      {rec.alias} - {rec.accountNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Monto"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="My Account USD"
                  value={accountUSD}
                  onChange={(e) => setAccountUSD(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100">Transferir</button>
            </form>

            <hr className="border-light mt-4" />
            <button className="btn btn-outline-light w-100" onClick={() => setShowAddForm(true)}>
              Add another account
            </button>
          </div>
        )}
        
        <Link to="/main" className="btn btn-light mt-4">
            <i className="bi bi-arrow-left-circle me-2"></i>Back to Home Page
        </Link>
      </div>
    </div>
  );
};

export default TransferSectionUUID;