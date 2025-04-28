const { db } = require('../models/loans');

const requestLoan = (req, res) => {
    const { userID, amount } = req.body;

    if (!userID || !amount) {
        return res.status(400).json({ error: 'Missing parameters in the request' });
    }

    if (amount < 100) {
        return res.status(400).json({ error: 'The minimum amount is $100 USD' });
    }

    if (amount > 600) {
        return res.status(400).json({ error: 'El monto maximo es de $600 USD' });
    }
    
    const countQuery = `SELECT COUNT(*) as total FROM loans WHERE userID = ?`;

    db.get(countQuery, [userID], (err, row) => {
        if (err) return res.status(500).json({ error: 'Error verifying loans' });

        if (row.total >= 2) {
            return res.status(403).json({ error: 'You have reached the maximum number of allowed loans' });
        }

        const insertQuery = `INSERT INTO loans (userID, amount) VALUES (?, ?)`;
        db.run(insertQuery, [userID, amount], function (err) {
            if (err) return res.status(500).json({ error: 'Error requesting loan' });

            
            const updateBalanceQuery = `
                UPDATE users
                SET balanceUSD = balanceUSD + ?
                WHERE userID = ?
            `;

            db.run(updateBalanceQuery, [amount, userID], function (err) {
                if (err) return res.status(500).json({ error: 'Error updating USD account' });

                
                const getUpdatedBalanceQuery = `SELECT balanceUSD FROM users WHERE userID = ?`;

                db.get(getUpdatedBalanceQuery, [userID], (err, user) => {
                    if (err) return res.status(500).json({ error: 'Error retrieving new balance' });
                    if (!user) return res.status(404).json({ error: 'User not found' });

                    return res.json({
                        message: 'Loan approved and deposited',
                        nuevoSaldo: parseFloat(user.balanceUSD)
                    });
                });
            });
        });
    });
};

const getUserLoans = (req, res) => {
    const { userID } = req.query;

    if (!userID) return res.status(400).json({ error: 'Falta userID' });

    const query = `SELECT * FROM loans WHERE userID = ? ORDER BY timestamp DESC`;

    db.all(query, [userID], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error retrieving loans' });

        return res.json({ loans: rows });
    });
};

module.exports = { requestLoan, getUserLoans };