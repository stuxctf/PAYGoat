import React, { useState } from 'react';
import api from '../../services/Api';

const ForgotPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/otp/send', { phoneNumber });
      setStep(2);
    } catch (error) {
      console.error('Error al enviar OTP', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Error al enviar OTP. Intenta de nuevo.');
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/user/reset-password', { phoneNumber, otp, newPassword: newPassword });
      window.location.href = '/login';
    } catch (error) {
      console.error('Error resetting password', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Error resetting the password. Please try again.');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      <form
        onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
        className="bg-secondary p-4 rounded shadow"
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <h2 className="text-center mb-4">{step === 1 ? 'Recover Password' : 'Reset Password'}</h2>

        {error && (
          <div className="alert alert-danger text-center py-2">{error}</div>
        )}

        {step === 1 ? (
          <>
            <div className="input-group mb-3">
              <span className="input-group-text bg-white border-0 rounded-start">
                <i className="bi bi-phone-fill"></i>
              </span>
              <input
                type="text"
                className="form-control border-0"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-light w-100 fw-bold">
              Send OTP
            </button>
          </>
        ) : (
          <>
            <div className="input-group mb-3">
              <span className="input-group-text bg-white border-0 rounded-start">
                <i className="bi bi-key-fill"></i>
              </span>
              <input
                type="text"
                className="form-control border-0"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div className="input-group mb-4">
              <input
                type="password"
                className="form-control border-0"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-group-text bg-white border-0 rounded-end">
                <i className="bi bi-lock-fill"></i>
              </span>
            </div>

            <button type="submit" className="btn btn-light w-100 fw-bold">
              Reset Password
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
