const { db } = require('../models/user');
const { faker } = require('@faker-js/faker');

const VALID_ROLES = ['FINANCE', 'AUDITOR'];

const getCompanyUsers = (req, res) => {
  const { companyID } = req.query;

  if (!companyID) {
    return res.status(400).json({ error: 'companyID required' });
  }

  db.all(
    `
    SELECT 
      businessUserID,
      username,
      firstname,
      lastname,
      role,
      phoneNumber,
      createdAt
    FROM business_users
    WHERE companyID = ?
    ORDER BY businessUserID ASC
    `,
    [companyID],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      return res.status(200).json(rows);
    }
  );
};

const createCompanyUser = (req, res) => {
  const {
    firstname,
    lastname,
    username,
    password,
    role,
    companyID
  } = req.body;

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Only FINANCE or AUDITOR allowed' });
  }

  if (!firstname || !lastname || !username || !password || !companyID) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.get(
    `SELECT businessUserID FROM business_users WHERE username = ?`,
    [username],
    (err, existingUser) => {
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const phoneNumber = '+54' + faker.string.numeric(10);

      db.run(
        `
        INSERT INTO business_users (
          companyID,
          username,
          firstname,
          lastname,
          password,
          role,
          phoneNumber
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [companyID, username, firstname, lastname, password, role, phoneNumber],
        function (err2) {
          if (err2) {
            return res.status(500).json({
              error: 'Failed to create business user',
              details: err2.message
            });
          }

          return res.status(201).json({
            message: 'Business user created',
            businessUserID: this.lastID,
            role
          });
        }
      );
    }
  );
};


const deleteCompanyUser = (req, res) => {
  const businessUserID = req.params.userID;

  if (!businessUserID) {
    return res.status(400).json({ error: 'businessUserID required' });
  }

  db.run(
    `DELETE FROM business_users WHERE businessUserID = ?`,
    [businessUserID],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: 'Failed to delete business user',
          details: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Business user not found' });
      }

      return res.status(200).json({
        message: 'Business user deleted from database',
        businessUserID
      });
    }
  );
};


module.exports = {
  getCompanyUsers,
  createCompanyUser,
  deleteCompanyUser
};
