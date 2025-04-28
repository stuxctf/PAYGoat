import React, { useState } from 'react';
import api from '../../services/Api';
import CryptoJS from 'crypto-js';
import { Link } from 'react-router-dom';

const GetCreditCard = () => {
  const [cardData, setCardData] = useState(null);
  const [error, setError] = useState('');

 
  const secretKey = CryptoJS.enc.Utf8.parse('0123456789abcabcdefdef0123456789');
  const iv = CryptoJS.enc.Utf8.parse('abc9876543210def'); 

  const encrypt = (text) => {
    const encrypted = CryptoJS.AES.encrypt(text, secretKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString(); 
  };

  const decrypt = (cipherText) => {
    const decrypted = CryptoJS.AES.decrypt(cipherText, secretKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  };

  const handleGetCreditCard = async () => {
    setError('');
    setCardData(null);
    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');

    if (!token || !userID) {
      setError('The users session was not found.');
      return;
    }

    const encryptedData = encrypt(userID);

    try {
      const response = await api.post('/bank/get-credit-card', { encryptedData }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const encryptedResponse = response.data.encryptedData;

      const decrypted = JSON.parse(decrypt(encryptedResponse));

      setCardData({
        creditCard: decrypted.creditCard,
        creditCardCVV: decrypted.creditCardCVV,
        creditCardExpMonth: decrypted.creditCardExpMonth,
        creditCardExpYear: decrypted.creditCardExpYear,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to get card details');
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-dark text-white">
      <div className="bg-secondary p-4 rounded shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Credit Card</h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        {cardData && (
          <div className="alert alert-success text-start">
            <p><strong>Número:</strong> {cardData.creditCard}</p>
            <p><strong>CVV:</strong> {cardData.creditCardCVV}</p>
            <p><strong>Exp:</strong> {cardData.creditCardExpMonth}/{cardData.creditCardExpYear}</p>
          </div>
        )}

        <button onClick={handleGetCreditCard} className="btn btn-light w-100 fw-bold">
          Get Card
        </button>
      </div>
      <Link to="/main" className="btn btn-light mt-4">
            <i className="bi bi-arrow-left-circle me-2"></i>Back to Home Page
        </Link>
    </div>
  );
};

export default GetCreditCard;
