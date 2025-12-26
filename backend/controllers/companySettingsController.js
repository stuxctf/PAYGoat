const { db } = require('../models/user');

const updateCompanySettings = (req, res) => {
  const { companyID, companyName, limitUSD, allowOverdraft } = req.body;

  db.run(
    `UPDATE companies
     SET companyName = ?, dailyLimitUSD = ?, allowOverdraft = ?
     WHERE companyID = ?`,
    [companyName, limitUSD, allowOverdraft ? 1 : 0, companyID],
    () => res.json({ message: 'Company updated' })
  );
};


const deleteCompany = (req, res) => {
  const { companyID } = req.params;

  db.run(`DELETE FROM companies WHERE companyID = ?`, [companyID]);
  db.run(`DELETE FROM company_users WHERE companyID = ?`, [companyID]);

  res.json({ message: 'Company deleted' });
};

module.exports = {
  updateCompanySettings,
  deleteCompany
};
