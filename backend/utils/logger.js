const { db } = require('../models/user');

const addAuditLog = (
    companyID,
    businessUserID,
    action,
    target = null,
    details = null
) => {

    if (!companyID || !action) {
        return;
    }

    const query = `
        INSERT INTO audit_logs
        (companyID, businessUserID, action, target, details)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
        query,
        [companyID, businessUserID, action, target, details],
        (err) => {
            if (err) {
                console.error('Error logging audit:', err.message);
            }
        }
    );
};

module.exports = { addAuditLog };
