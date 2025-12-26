import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './paygoat.png';

const handleLogout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

const MainPage = () => {
  const [showAccountsSubmenu, setShowAccountsSubmenu] = useState(false);
  const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);
  const [showCreditsSubmenu, setShowCreditsSubmenu] = useState(false);
  const [showTransactionsSubmenu, setShowTransactionsSubmenu] = useState(false);
  const [showBusinessTransfersSubmenu, setShowBusinessTransfersSubmenu] = useState(false);

  const userType = Number(localStorage.getItem('userType')); 
  const role = userType === 2 ? localStorage.getItem('role') : null;
  const companyID = userType === 2 ? localStorage.getItem('companyID') : null;

  const isOwner = role === 'OWNER';
  const isFinance = role === 'FINANCE';
  const isAuditor = role === 'AUDITOR';

  // Solo mostrar perfil normal y configuraciones si NO es Finance ni Auditor
  const showNormalProfile = !(isFinance || isAuditor);

  return (
    <div className="d-flex vh-100 bg-dark text-white">

      {/* ===============================
          MENÚ LATERAL
         =============================== */}
      <div className="bg-secondary p-4 d-flex flex-column" style={{ width: '260px' }}>
        <h4 className="mb-4">PAYGOAT</h4>

        {/* PERFIL */}
        {isFinance || isAuditor ? (
          <Link to="/business-profile" className="btn btn-outline-light mb-2 text-start">
            <i className="bi bi-person-circle me-2"></i> Business Profile
          </Link>
        ) : (
          <Link to="/profile" className="btn btn-outline-light mb-2 text-start">
            <i className="bi bi-person-circle me-2"></i> Profile
          </Link>
        )}

        {/* ===============================
            CUENTAS PERSONALES
           =============================== */}
        {showNormalProfile && (
          <>
            <button
              className="btn btn-outline-light mb-2 text-start"
              onClick={() => setShowAccountsSubmenu(!showAccountsSubmenu)}
            >
              <i className="bi bi-wallet2 me-2"></i> My Accounts
            </button>

            {showAccountsSubmenu && (
              <div className="ms-3 mb-2">
                <Link to="/account-details" className="btn btn-sm btn-outline-light d-block mb-1 text-start">
                  Details
                </Link>
                <Link to="/account-history" className="btn btn-sm btn-outline-light d-block text-start">
                  History
                </Link>
              </div>
            )}

            <button
              className="btn btn-outline-light mb-2 text-start"
              onClick={() => setShowTransactionsSubmenu(!showTransactionsSubmenu)}
            >
              <i className="bi bi-arrow-left-right me-2"></i> Transactions
            </button>

            {showTransactionsSubmenu && (
              <div className="ms-3 mb-2">
                <Link to="/transactions" className="btn btn-sm btn-outline-light d-block mb-1 text-start">
                  Transactions
                </Link>
                <Link to="/transactionsUUID" className="btn btn-sm btn-outline-light d-block text-start">
                  Transactions v2 (UUID)
                </Link>
              </div>
            )}

            <Link to="/cards" className="btn btn-outline-light mb-2 text-start">
              <i className="bi bi-credit-card-2-front-fill me-2"></i> CreditCards
            </Link>

            <button
              className="btn btn-outline-light mb-2 text-start"
              onClick={() => setShowCreditsSubmenu(!showCreditsSubmenu)}
            >
              <i className="bi bi-cash-coin me-2"></i> Créditos
            </button>

            {showCreditsSubmenu && (
              <div className="ms-3 mb-2">
                <Link to="/request-loans" className="btn btn-sm btn-outline-light d-block mb-1 text-start">
                  <i className="bi bi-file-earmark-text me-2"></i> Solicitar Crédito
                </Link>
                <Link to="/my-loans" className="btn btn-sm btn-outline-light d-block mb-1 text-start">
                  <i className="bi bi-journal-check me-2"></i> Mis Créditos
                </Link>
              </div>
            )}

            <Link to="/tickets" className="btn btn-outline-light mb-2 text-start">
              <i className="bi bi-ticket-perforated"></i> Tickets
            </Link>
          </>
        )}

        {/* CONFIGURACIÓN SOLO PARA NORMAL Y OWNER */}
        {showNormalProfile && (
          <>
            <button
              className="btn btn-outline-light mb-2 text-start"
              onClick={() => setShowSettingsSubmenu(!showSettingsSubmenu)}
            >
              <i className="bi bi-gear me-2"></i> Configuración
            </button>

            {showSettingsSubmenu && (
              <div className="ms-3 mb-2">
                <Link to="/update-profile" className="btn btn-sm btn-outline-light d-block mb-1 text-start">
                  <i className="bi bi-pencil-square me-2"></i> Actualizar Perfil
                </Link>
                <Link to="/update-password" className="btn btn-sm btn-outline-light d-block mb-1 text-start">
                  <i className="bi bi-shield-lock me-2"></i> Actualizar Contraseña
                </Link>
                <Link to="/delete-account" className="btn btn-sm btn-outline-light d-block text-start">
                  <i className="bi bi-trash me-2"></i> Eliminar Cuenta
                </Link>
              </div>
            )}
          </>
        )}

        {/* ===============================
            BANCA EMPRESARIAL
           =============================== */}
        {userType === 2 && (
          <>
            <hr />
            <h6 className="text-uppercase text-muted">Business</h6>

            {/* TODOS LOS ROLES */}
            {(isOwner || isFinance) && (
              
              <>
              <Link to="/business/accounts" className="btn btn-outline-light mb-2 text-start">
                <i className="bi bi-building me-2"></i> Company Accounts
              </Link>
                <button
                  className="btn btn-outline-light mb-2 text-start"
                  onClick={() => setShowBusinessTransfersSubmenu(!showBusinessTransfersSubmenu)}
                >
                  <i className="bi bi-send me-2"></i> Company Transfers
                </button>

                {showBusinessTransfersSubmenu && (
                  <div className="ms-3 mb-2">
                    <Link to="/business/transfers" className="btn btn-sm btn-outline-light d-block mb-1 text-start">
                      Create Transfer
                    </Link>

                    {isOwner && (
                      <Link to="/business/approve" className="btn btn-sm btn-outline-warning d-block text-start">
                        Approve Transfers
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}

            {/* OWNER SOLO */}
            {isOwner && (
              <>
                <Link to="/business/ActionsUsers" className="btn btn-outline-warning mb-2 text-start">
                  <i className="bi bi-people-fill me-2"></i> Manage Users
                </Link>
                <Link to="/business/CompanySettings" className="btn btn-outline-danger mb-2 text-start">
                  <i className="bi bi-shield-lock-fill me-2"></i> Company Settings
                </Link>
              </>
            )}

            {/* AUDITOR SOLO */}
            {(isAuditor || isOwner) && (
              <Link to="/business/GetLogs" className="btn btn-outline-info mb-2 text-start">
                <i className="bi bi-journal-text me-2"></i> Audit Logs
              </Link>
            )}
          </>
        )}

        <button onClick={handleLogout} className="btn btn-outline-danger mt-auto">
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>

      {/* ===============================
          CONTENIDO PRINCIPAL
         =============================== */}
      <div className="flex-grow-1 d-flex flex-column">
        <div className="bg-dark p-3 text-center shadow">
          <h3>
            {userType === 2 ? 'Business Banking Dashboard' : 'Personal Banking'}
          </h3>
        </div>

        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <img
              src={logoImage}
              alt="PAYGOAT"
              className="img-fluid mb-4"
              style={{ maxWidth: '720px' }}
            />

            <p className="text-muted small">
              Session Type: {userType === 2 ? 'BUSINESS' : 'PERSONAL'} <br />
              Role: {role || 'N/A'} <br />
              CompanyID: {companyID || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;



