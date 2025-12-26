import React, { useEffect, useState } from 'react';
import api from '../../services/Api';
import { Link } from 'react-router-dom';

const CompanyTransfers = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchDetail, setBatchDetail] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const [currency, setCurrency] = useState('USD');
  const [transfers, setTransfers] = useState([]);
  const [targetAccount, setTargetAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [csvFile, setCsvFile] = useState(null);

  const role = localStorage.getItem('role');
  const companyID = localStorage.getItem('companyID');
  const token = localStorage.getItem('token');

  const canManageBatch = role === 'FINANCE' || role === 'OWNER';

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    const res = await api.get(`/business/batch?companyID=${companyID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBatches(res.data);
  };

  const fetchBatchDetail = async (batchID) => {
    if (showHistory) return;
    const res = await api.get(`/business/batch/${batchID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data;
    setBatchDetail({
      items: data.items || data || [],
      status: data.status || 'PENDING',
      batchID: data.batchID || batchID,
    });
    setSelectedBatch(batchID);
  };

  const createBatch = async () => {
    if (transfers.length === 0) return;
    await api.post(
      '/business/batch',
      { companyID, createdBy: role, currency, transfers },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTransfers([]);
    fetchBatches();
  };

  const addTransfer = () => {
    if (!targetAccount || !amount) return;
    setTransfers([...transfers, { targetAccount, amount: Number(amount) }]);
    setTargetAccount('');
    setAmount('');
  };

const uploadCSV = async () => {
  if (!csvFile) return;

  const formData = new FormData();
  formData.append('file', csvFile);
  formData.append('currency', currency);
  formData.append('companyID', companyID);
  formData.append('createdBy', role);

  await api.post('/business/batch/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  setCsvFile(null);
  fetchBatches();
}
  const approveBatch = async () => {
    if (!selectedBatch) return;
    await api.post(
      `/business/batch/${selectedBatch}/approve`,
      { companyID },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchBatches();
    fetchBatchDetail(selectedBatch);
  };

  const declineBatch = async () => {
    if (!selectedBatch) return;
    await api.post(
      `/business/batch/${selectedBatch}/decline`,
      { companyID },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchBatches();
    fetchBatchDetail(selectedBatch);
  };

  const displayedBatches = showHistory
    ? batches.filter((b) => b.status !== 'PENDING')
    : batches.filter((b) => b.status === 'PENDING');

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-dark text-white p-3">
      <div className="bg-secondary p-4 rounded shadow" style={{ width: '100%', maxWidth: '600px' }}>
        <h3 className="text-center mb-4">
          <i className="bi bi-cash-stack me-2"></i>
          Company Transfers
        </h3>

        {canManageBatch && !showHistory && (
          <>
            {/* CREAR BATCH MANUAL */}
            <label>Currency</label>
            <select className="form-select mb-3" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>

            <label>Target Account</label>
            <input
              className="form-control mb-3"
              placeholder="User Bank Account"
              value={targetAccount}
              onChange={(e) => setTargetAccount(e.target.value)}
            />

            <label>Amount</label>
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button className="btn btn-light w-100 mb-3" onClick={addTransfer}>
              Add Transfer
            </button>

            {transfers.length > 0 && (
              <table className="table table-dark table-bordered mb-3">
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((t, i) => (
                    <tr key={i}>
                      <td>{t.targetAccount}</td>
                      <td>{t.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              className="btn btn-success w-100 mb-3"
              onClick={createBatch}
              disabled={transfers.length === 0}
            >
              Create Batch
            </button>

            {/* BATCH POR CSV */}
            <label>Upload CSV</label>
            <input
              type="file"
              className="form-control mb-2"
              onChange={(e) => setCsvFile(e.target.files[0])}
            />
            {csvFile && (
              <button className="btn btn-outline-light w-100 mb-3" onClick={uploadCSV}>
                Upload CSV and Create Batch
              </button>
            )}
          </>
        )}

        {/* Historial */}
        <button
          className="btn btn-info w-100 mb-3"
          onClick={() => {
            setShowHistory(!showHistory);
            setSelectedBatch(null);
            setBatchDetail(null);
          }}
        >
          {showHistory ? 'Back to Pending' : 'Show History'}
        </button>

        {/* BATCH LIST */}
        <h5 className="mt-3">{showHistory ? 'Batch History' : 'Pending Batches'}</h5>
        <table className="table table-dark table-bordered mb-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedBatches.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.currency}</td>
                <td>{b.status}</td>
                <td>
                  {!showHistory && (
                    <button className="btn btn-sm btn-light" onClick={() => fetchBatchDetail(b.id)}>
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* BATCH DETAIL */}
        {batchDetail && !showHistory && (
          <div className="mt-3">
            <h5>Batch #{batchDetail.batchID}</h5>
            <table className="table table-dark table-bordered mb-3">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {batchDetail.items.map((i, idx) => (
                  <tr key={idx}>
                    <td>{i.targetAccount}</td>
                    <td>{i.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {role === 'OWNER' && batchDetail.status === 'PENDING' && (
              <div className="d-flex gap-2">
                <button className="btn btn-success w-50" onClick={approveBatch}>
                  Approve
                </button>
                <button className="btn btn-danger w-50" onClick={declineBatch}>
                  Decline
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Link to="/main" className="btn btn-light mt-3 w-50 text-center">
        <i className="bi bi-arrow-left-circle me-2"></i>
        Back to Home Page
      </Link>
    </div>
  );
};

export default CompanyTransfers;
