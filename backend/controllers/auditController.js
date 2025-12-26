const { db } = require('../models/user');

const getAuditLogs = (req, res) => {
  const { companyID } = req.query;

  if (!companyID) {
    return res.status(400).json({ error: 'companyID required' });
  }

  const query = `
    SELECT *
    FROM audit_logs
    WHERE companyID = ?
    ORDER BY createdAt DESC
  `;

  db.all(query, [companyID], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};


module.exports = { getAuditLogs };
