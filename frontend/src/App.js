import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import MainPage from './components/Dashboard/MainPage';
import UserProfile from './components/Dashboard/UserProfile';
import Transactions from './components/Dashboard/Transactions';
import TransferSectionUUID from './components/Dashboard/Transactionsuuid';
import UserAccounts from './components/Dashboard/UserAccounts';
import UpdateProfile from './components/Dashboard/UpdateUser'
import UpdatePasswordProfile from './components/Dashboard/UpdatePassword'
import DeleteAccountProfile from './components/Dashboard/DeleteUser'
import TransactionHistory from './components/Dashboard/TransactionHistory'
import UserLoans from './components/Dashboard/UserLoans'
import LoanRequest from './components/Dashboard/UserRequestLoans'
import GetCreditCard from './components/Dashboard/CreditCard'
import Support from './components/Dashboard/Tickets'

const PrivateRoute = ({ component: Component }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/main" element={<PrivateRoute component={MainPage} />} />
        <Route path="/profile" element={<PrivateRoute component={UserProfile} />} />
        <Route path="/transactions" element={<PrivateRoute component={Transactions} />} />
        <Route path="/transactionsUUID" element={<PrivateRoute component={TransferSectionUUID} />} />
        <Route path="/account-details" element={<PrivateRoute component={UserAccounts} />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/update-password" element={<UpdatePasswordProfile />} />
        <Route path="/delete-account" element={<DeleteAccountProfile />} />
        <Route path="/account-history" element={<TransactionHistory />} />
        <Route path="/request-loans" element={<LoanRequest />} />
        <Route path="/my-loans" element={<UserLoans />} />
        <Route path="/cards" element={<GetCreditCard />} />
        <Route path="/tickets" element={<Support />} />
         <Route path="/tickets/:id" element={<Support />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;