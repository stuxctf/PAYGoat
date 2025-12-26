import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/Api';

const BusinessUsers = () => {
  const [users, setUsers] = useState([]);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FINANCE');

  const companyID = localStorage.getItem('companyID');
  const token = localStorage.getItem('token');

  useEffect(() => {
    loadUsers();
  }, []);

  /* ===============================
     LOAD USERS
     =============================== */
  const loadUsers = async () => {
    try {
      const res = await api.get('/business/users', {
        params: { companyID },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setUsers([]);
    }
  };

  /* ===============================
     CREATE USER
     =============================== */
  const createUser = async () => {
    if (!firstname || !lastname || !username || !password) return;

    try {
      await api.post(
        '/business/users/create',
        {
          firstname,
          lastname,
          username,
          password,
          role,
          companyID
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setFirstname('');
      setLastname('');
      setUsername('');
      setPassword('');
      setRole('FINANCE');
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating user');
    }
  };

  /* ===============================
     DELETE USER
     =============================== */
  const deleteUser = async (userID) => {
    try {
      await api.delete(`/business/users/delete/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      loadUsers();
    } catch {
  
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-dark text-white">

      <div
        className="bg-secondary p-4 rounded shadow"
        style={{ width: '100%', maxWidth: '900px' }}
      >
        <h3 className="text-center mb-4">
          <i className="bi bi-people-fill me-2"></i>
          Company Users
        </h3>

        {/* CREATE USER */}
        <div className="mb-4">

          <input
            className="form-control mb-2"
            placeholder="First name"
            value={firstname}
            onChange={e => setFirstname(e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Last name"
            value={lastname}
            onChange={e => setLastname(e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-2"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <select
            className="form-control mb-3"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="FINANCE">FINANCE</option>
            <option value="AUDITOR">AUDITOR</option>
          </select>

          <button
            onClick={createUser}
            className="btn btn-light w-100 fw-bold"
            disabled={!firstname || !lastname || !username || !password}
          >
            Add User
          </button>
        </div>

        {/* USERS TABLE */}
        <div className="table-responsive">
          <table className="table table-dark table-bordered align-middle mb-0">
            <thead>
              <tr>
                <th>UserID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No users found
                  </td>
                </tr>
              )}

            {users.map(u => (
              <tr key={u.businessUserID}>
                <td>{u.businessUserID}</td>
                <td>{u.username}</td>
                <td>
                  <span className="badge bg-info text-dark">
                    {u.role}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUser(u.businessUserID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>

      <Link to="/main" className="btn btn-light mt-4">
        <i className="bi bi-arrow-left-circle me-2"></i>
        Back to Home Page
      </Link>
    </div>
  );
};

export default BusinessUsers;
