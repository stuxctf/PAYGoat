const { db } = require('../models/user');

const getAccountDetails = (req, res) => {
    const { userID } = req.body;  

    if (!userID) {
        return res.status(400).json({ error: 'User ID not provided' });
    }

    const query = 'SELECT accountUSD, balanceUSD, accountEUR, balanceEUR FROM users WHERE userID = ?';

    db.get(query, [userID], (err, row) => {
        if (err) {
            console.error('SQLite Error:', err.message);
            return res.status(500).json({ error: 'Error retrieving account data' });
        }

        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: 'Account data retrieved successfully',
            data: row
        });
    });
};

const getTransactionHistory = (req, res) => {
    const { account } = req.query;

    if (!account) {
        const query = `
            SELECT t.*, 
                u1.accountUSD AS senderUSD, u1.accountEUR AS senderEUR,
                u2.accountUSD AS recipientUSD, u2.accountEUR AS recipientEUR
            FROM transactions t
            LEFT JOIN users u1 ON t.senderID = u1.userID
            LEFT JOIN users u2 ON t.recipientID = u2.userID
            ORDER BY t.timestamp DESC
        `;

        db.all(query, [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            const formatted = rows.map(tx => ({
                ...tx,
                senderAccount: tx.senderUSD || tx.senderEUR || null,
                recipientAccount: tx.recipientUSD || tx.recipientEUR || null
            }));

            return res.json({ transactions: formatted });
        });

        return;
    }

    const accountRegex = /^(USD|EUR)\d+$/;
    let safeAccount = account;

    if (accountRegex.test(account)) {
        
        safeAccount = `'${account}'`;
    } else {
        safeAccount = account;
    }

    const txQuery = `
        SELECT t.*,
            u1.accountUSD AS senderUSD, u1.accountEUR AS senderEUR,
            u2.accountUSD AS recipientUSD, u2.accountEUR AS recipientEUR
        FROM transactions t
        LEFT JOIN users u1 ON t.senderID = u1.userID
        LEFT JOIN users u2 ON t.recipientID = u2.userID
        WHERE u1.accountUSD = ${safeAccount} OR u1.accountEUR = ${safeAccount} OR u2.accountUSD = ${safeAccount} OR u2.accountEUR = ${safeAccount}
        ORDER BY t.timestamp DESC
    `;

    db.all(txQuery, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const formatted = rows.map(tx => ({
            ...tx,
            senderAccount: tx.senderUSD || tx.senderEUR || null,
            recipientAccount: tx.recipientUSD || tx.recipientEUR || null
        }));

        return res.json({ transactions: formatted });
    });
};


module.exports = { getAccountDetails, getTransactionHistory };
