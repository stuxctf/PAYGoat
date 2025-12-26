import React, { useEffect, useState } from 'react';
import api from '../../services/Api';
import { Link } from 'react-router-dom';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [userID, setUserID] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const companyID = localStorage.getItem('companyID');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const res = await api.get(`/business/audit?companyID=${companyID}`);
    setLogs(res.data);
    setFilteredLogs(res.data);
    setCurrentPage(1);
  };

  const filterByUser = () => {
    if (!userID) {
      setFilteredLogs(logs);
      setCurrentPage(1);
      return;
    }

    const filtered = logs.filter(
      log => String(log.businessUserID) === String(userID)
    );

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-dark text-white">

      <div
        className="bg-secondary p-4 rounded shadow"
        style={{ width: '100%', maxWidth: '1000px' }}
      >
        <h3 className="text-center mb-4">
          <i className="bi bi-journal-text me-2"></i>
          Audit Logs
        </h3>

        {/* FILTER */}
        <div className="d-flex mb-3">
          <input
            className="form-control me-2"
            placeholder="Filter by BusinessUserID"
            value={userID}
            onChange={e => setUserID(e.target.value)}
          />
          <button className="btn btn-light fw-bold" onClick={filterByUser}>
            Filter
          </button>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <table className="table table-dark table-bordered align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>BusinessUserID</th>
                <th>Action</th>
                <th>Target</th>
                <th>Details</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {currentLogs.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No audit logs found
                  </td>
                </tr>
              )}

              {currentLogs.map(log => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.businessUserID ?? '-'}</td>
                  <td>
                    <span className="badge bg-info text-white">
                      {log.action}
                    </span>
                  </td>
                  <td>{log.target || '-'}</td>
                  <td className="small text-white">
                    {log.details || '-'}
                  </td>
                  <td>{log.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length > logsPerPage && (
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-outline-light"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="align-self-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline-light"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Link to="/main" className="btn btn-light mt-4">
        <i className="bi bi-arrow-left-circle me-2"></i>
        Back to Home Page
      </Link>
    </div>
  );
};

export default AuditLogs;
