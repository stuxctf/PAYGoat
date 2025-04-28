import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './paygoat.png';

const handleLogout = () => {
  localStorage.removeItem("authToken");
  window.location.href = "/login";
};

const MainPage = () => {
  const [showAccountsSubmenu, setShowAccountsSubmenu] = useState(false);
  const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);
  const [showCreditsSubmenu, setShowCreditsSubmenu] = useState(false);
  const [ShowTransacctionsSubmenu, setShowTransacctionsSubmenu] = useState(false);

  return (
    <div className="d-flex vh-100 bg-dark text-white">
      {/* Menú lateral */}
      <div className="bg-secondary p-4 d-flex flex-column" style={{ width: '250px' }}>
        <h4 className="mb-4">Menú</h4>

        <Link to="/profile" className="btn btn-outline-light mb-2 text-start">
          <i className="bi bi-person-circle me-2"></i> Profile
        </Link>

        {/* Mis Cuentas */}
        <button
          className="btn btn-outline-light mb-2 text-start"
          onClick={() => setShowAccountsSubmenu(!showAccountsSubmenu)}
        >
          <i className="bi bi-wallet2 me-2"></i> My Accounts
        </button>

        {showAccountsSubmenu && (
          <div className="ms-3 mb-2">
            <Link to="/account-details" className="btn btn-sm btn-outline-light d-block mb-1 text-start">
              <i className="bi bi-info-circle me-2"></i> Details
            </Link>
            <Link to="/account-history" className="btn btn-sm btn-outline-light d-block text-start">
              <i className="bi bi-clock-history me-2"></i> History
            </Link>
          </div>
        )}

        {/* Mis transacciones */}
        <button
          className="btn btn-outline-light mb-2 text-start"
          onClick={() => setShowTransacctionsSubmenu(!ShowTransacctionsSubmenu)}
        >
          <i className="bi bi-wallet2 me-2"></i> Transactions
        </button>

        {ShowTransacctionsSubmenu && (
          <div className="ms-3 mb-2">
            <Link to="/transactions" className="btn btn-sm btn-outline-light d-block mb-1 text-start">
              <i className="bi bi-info-circle me-2"></i> Transactions
            </Link>
            <Link to="/transactionsUUID" className="btn btn-sm btn-outline-light d-block text-start">
              <i className="bi bi-clock-history me-2"></i> Transactionsv2 (BETA)
            </Link>
          </div>
        )}

        {/* CC */}
        <Link to="/cards" className="btn btn-outline-light mb-2 text-start">
          <i className="bi bi-credit-card-2-front-fill me-2"></i> CreditCards
        </Link>

        {/* Créditos */}
        <button
          className="btn btn-outline-light mb-2 text-start"
          onClick={() => setShowCreditsSubmenu(!showCreditsSubmenu)}
        >
          <i className="bi bi-cash-coin me-2"></i> Loans
        </button>

        {showCreditsSubmenu && (
          <div className="ms-3 mb-2">
            <Link to="/request-loans" className="btn btn-sm btn-outline-light d-block mb-1 text-start">
              <i className="bi bi-file-earmark-text me-2"></i> Request Loans
            </Link>
            <Link to="/my-loans" className="btn btn-sm btn-outline-light d-block mb-1 text-start">
              <i className="bi bi-journal-check me-2"></i> My Loans
            </Link>
          </div>
        )}

        {/* Configuración */}
        <button
          className="btn btn-outline-light mb-2 text-start"
          onClick={() => setShowSettingsSubmenu(!showSettingsSubmenu)}
        >
          <i className="bi bi-gear me-2"></i> Settings 
        </button>

        {showSettingsSubmenu && (
          <div className="ms-3 mb-2">
            <Link to="/update-profile" className="btn btn-sm btn-outline-light d-block mb-1 text-start">
              <i className="bi bi-pencil-square me-2"></i> Update Profile
            </Link>
            <Link to="/update-password" className="btn btn-sm btn-outline-light d-block mb-1 text-start">
              <i className="bi bi-shield-lock me-2"></i> Update Password
            </Link>
            <Link to="/delete-account" className="btn btn-sm btn-outline-light d-block text-start">
              <i className="bi bi-trash me-2"></i> Delete Account
            </Link>
          </div>
        )}

        {/* Logout */}
        <button onClick={handleLogout} className="btn btn-outline-danger mt-auto">
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Encabezado superior */}
        <div className="bg-dark p-3 text-white text-center shadow">
          <h3>Welcome to Online Banking</h3>
        </div>

        {/* Contenido central */}
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <img
              src={logoImage}
              alt="Imagen central"
              className="img-fluid mb-4"
              style={{ maxWidth: '720px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
