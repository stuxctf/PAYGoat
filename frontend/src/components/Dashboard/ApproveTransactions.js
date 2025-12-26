import React, { useEffect, useState } from 'react';
import api from '../../services/Api';
import { Link } from 'react-router-dom';

const ApproveTransactions = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchDetail, setBatchDetail] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const batchesPerPage = 10;

  const token = localStorage.getItem('token');
  const companyID = localStorage.getItem('companyID');
  const role = localStorage.getItem('role');

  const canApprove = role === 'OWNER';

  useEffect(() => {
    fetchPendingBatches();
  }, []);

  /* =========================
     PENDING BATCHES
     ========================= */
  const fetchPendingBatches = async () => {
    const res = await api.get(`/business/batch?companyID=${companyID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setBatches(res.data.filter(b => b.status === 'PENDING'));
  };

  /* =========================
    BATCH DETAIL
     ========================= */
  const fetchBatchDetail = async (batchID) => {
    const res = await api.get(`/business/batch/${batchID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setBatchDetail(res.data);
    setSelectedBatch(batchID);
  };

  /* =========================
     APPROVE / DECLINE
     ========================= */
  const approveBatch = async () => {
    if (!selectedBatch) return;

    await api.post(
      `/business/batch/${selectedBatch}/approve`,
      { companyID },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchPendingBatches();
    setBatchDetail(null);
    setSelectedBatch(null);
  };

  const declineBatch = async () => {
    if (!selectedBatch) return;

    await api.post(
      `/business/batch/${selectedBatch}/decline`,
      { companyID },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchPendingBatches();
    setBatchDetail(null);
    setSelectedBatch(null);
  };

  const indexOfLastBatch = currentPage * batchesPerPage;
  const indexOfFirstBatch = indexOfLastBatch - batchesPerPage;
  const currentBatches = batches.slice(indexOfFirstBatch, indexOfLastBatch);
  const totalPages = Math.ceil(batches.length / batchesPerPage);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-dark text-white">
      <div
        className="bg-secondary p-4 rounded shadow"
        style={{ width: '100%', maxWidth: '700px' }}
      >
        <h3 className="text-center mb-4">
          <i className="bi bi-check2-circle me-2"></i>
          Approve Transactions
        </h3>

        {/* =========================
            BATCH LIST
           ========================= */}
        <h5>Pending Batches</h5>
        <table className="table table-dark table-bordered mb-3">
          <thead>
            <tr>
              <th>BatchID</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentBatches.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No pending batches
                </td>
              </tr>
            )}

            {currentBatches.map(batch => (
              <tr key={batch.batchID}>
                <td>{batch.batchID}</td>
                <td>{batch.currency}</td>
                <td>{batch.status}</td>
                <td>
                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => fetchBatchDetail(batch.batchID)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="d-flex justify-content-center gap-2 mb-3">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${
                  currentPage === i + 1 ? 'btn-primary' : 'btn-light'
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* =========================
            BATCH DETAIL
           ========================= */}
        {batchDetail && (
          <div className="mt-3">
            <h5>Batch #{selectedBatch}</h5>

            <table className="table table-dark table-bordered mb-3">
              <thead>
                <tr>
                  <th>Target Account</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {batchDetail.map((t, idx) => (
                  <tr key={idx}>
                    <td>{t.targetAccount}</td>
                    <td>{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {canApprove && (
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

export default ApproveTransactions;
