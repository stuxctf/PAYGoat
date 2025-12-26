const { db } = require('../models/bunisses_transacctions');

const getBusinessAccounts = (req, res) => {
  const { companyID } = req.body;

  if (!companyID) {
    return res.status(400).json({ error: 'Company ID is required' });
  }
  const companyQuery = 'SELECT companyName FROM companies WHERE companyID = ?';
  db.get(companyQuery, [companyID], (err, company) => {
    if (err || !company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const accountsQuery = `
      SELECT accountNumber, balance FROM business_accounts
      WHERE companyID = ?
    `;

    db.all(accountsQuery, [companyID], (err, accounts) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching accounts' });
      }

      return res.status(200).json({
        companyID,
        companyName: company.companyName,
        accounts: accounts || [],
      });
    });
  });
};

module.exports = { getBusinessAccounts };