import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/Api';

const Transactions = () => {
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [transactionType, setTransactionType] = useState('internal'); 

  const currencyFrom = 'USD';
  const currencyTo = 'EUR';
  const rate = 1;

  const handleTransaction = async (e) => {
    e.preventDefault();
  
    let transactionData = {
      senderAccountNumber: fromAccount,
      recipientAccountNumber: toAccount,
      amount: parseFloat(amount),
    };
  
    let endpoint = '';
  
    if (transactionType === 'internal') {
      transactionData.currencyFrom = currencyFrom;
      transactionData.currencyTo = currencyTo;
      transactionData.rate = rate;
      endpoint = '/payment/transfer';
    }
  
    if (transactionType === 'external') {
      endpoint = '/payment/transferthirdparties';
    }
  
    try {
      const response = await api.post(endpoint, transactionData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      
      alert(response.data.message);
    } catch (error) {
      
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('Error inesperado');
      }
    }
  }; 

  return (
    <div className="d-flex vh-100 bg-dark text-white">
      
      <div className="bg-secondary p-4 d-flex flex-column" style={{ width: '250px' }}>
        <h4 className="mb-4"></h4>
  
      </div>

      
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        
        <div className="w-100" style={{ maxWidth: '600px' }}>
          <form onSubmit={handleTransaction} className="shadow p-4 rounded bg-dark">
            <div className="mb-3">
              <label htmlFor="transactionType" className="form-label">Transfer Type</label>
              <select
                id="transactionType"
                className="form-select"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="internal">Inter-Accounts (USD to EUR)</option>
                <option value="external">To another user (USD to USD)</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="fromAccount" className="form-label">Source Account</label>
              <input
                type="text"
                id="fromAccount"
                className="form-control"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                placeholder="Source Account"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="toAccount" className="form-label">Cuenta de Destino</label>
              <input
                type="text"
                id="toAccount"
                className="form-control"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                placeholder="Destination Account"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="amount" className="form-label">Amount</label>
              <input
                type="number"
                id="amount"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                required
              />
            </div>

            
            <div style={{ display: 'none' }}>
              <div className="mb-3">
                <label htmlFor="currencyFrom" className="form-label">Currency of Origin</label>
                <input
                  type="text"
                  id="currencyFrom"
                  className="form-control"
                  value={currencyFrom}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label htmlFor="currencyTo" className="form-label">Destination Currency</label>
                <input
                  type="text"
                  id="currencyTo"
                  className="form-control"
                  value={currencyTo}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label htmlFor="rate" className="form-label">Exchange Rate</label>
                <input
                  type="number"
                  id="rate"
                  className="form-control"
                  value={rate}
                  disabled
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100">Send Transaction</button>
          </form>
              
              <Link to="/main" className="btn btn-light mt-4">
              <i className="bi bi-arrow-left-circle me-2"></i>Back to Home Page
            </Link>
        </div>
      </div>


      
    </div>
  );
};

export default Transactions;
