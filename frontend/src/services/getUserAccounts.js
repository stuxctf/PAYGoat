import api from './Api';

const getUserAccounts = async () => {
  const token = localStorage.getItem('token');
  const userID = localStorage.getItem('userID');

  if (!token || !userID) {
    throw new Error('No se encontró la sesión del usuario.');
  }

  const response = await api.post(
    '/bank/account',
    { userID },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data.data;
};

export default getUserAccounts;