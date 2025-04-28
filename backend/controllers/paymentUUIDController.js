const { db } = require('../models/user');

const transferFundsUUID = (req, res) => {
    const { accountUSD, recipientUUID, amount } = req.body;

    if (!accountUSD || !recipientUUID || typeof amount !== 'number') {
        return res.status(400).json({ error: 'Missing parameters in the request' });
    }

    if (amount <= 0) {
        return res.status(400).json({ error: 'The amount must be greater than 0' });
    }  // in the new version amount validate negative numbers

    const getSenderQuery = `SELECT userID, balanceUSD, uuidUSD FROM users WHERE accountUSD = ?`;
    db.get(getSenderQuery, [accountUSD], (err, sender) => {
        if (err || !sender) {
            return res.status(404).json({ error: 'Source account not found' });
        }

        if (sender.balanceUSD < amount) {
            return res.status(400).json({ error: 'Insufficient balance to complete the transfer' });
        }

        
        const getRecipientQuery = `SELECT userID FROM users WHERE uuidUSD = ?`;
        db.get(getRecipientQuery, [recipientUUID], (err, recipient) => {
            if (err || !recipient) {
                return res.status(404).json({ error: 'Destination account not found' });
            }

            
            const updateSenderBalance = `
                UPDATE users SET balanceUSD = balanceUSD - ? WHERE userID = ?
            `;
            db.run(updateSenderBalance, [amount, sender.userID], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Error updating senders balance' });
                }

                
                const updateRecipientBalance = `
                    UPDATE users SET balanceUSD = balanceUSD + ? WHERE uuidUSD = ?
                `;
                db.run(updateRecipientBalance, [amount, recipientUUID], function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Error updating recipients balance' });
                    }

                    return res.status(200).json({
                        message: 'USD transfer completed',
                        fromAccount: accountUSD,
                        from: sender.uuidUSD,
                        to: recipientUUID,
                        amount
                    });
                });
            });
        });
    });
};

const registerAlias = (req, res) => {
    const { alias, accountNumber, userID } = req.body;

    if (!alias || !accountNumber || !userID) {
        return res.status(400).json({ error: 'Missing alias, account number or userID' });
    }

    let getAccountUUIDQuery;
    if (accountNumber.startsWith('US')) {
        getAccountUUIDQuery = `SELECT uuidUSD FROM users WHERE accountUSD = ?`;
    } else if (accountNumber.startsWith('EU')) {
        getAccountUUIDQuery = `SELECT uuidEUR FROM users WHERE accountEUR = ?`;
    } else {
        return res.status(400).json({ error: 'Invalid account number' });
    }

    db.get(getAccountUUIDQuery, [accountNumber], (err, user) => {
        if (err || !user) {
            return res.status(500).json({ error: 'Error retrieving account UUID' });
        }

        const accountUUID = accountNumber.startsWith('US') ? user.uuidUSD : user.uuidEUR;

        if (!accountUUID) {
            return res.status(400).json({ error: 'No UUID found for the provided account' });
        }

        
        const checkDuplicateAlias = `
            SELECT * FROM accounts_identifiers WHERE ownerID = ? AND alias = ?
        `;
        db.get(checkDuplicateAlias, [userID, alias], (err, existingAlias) => {
            if (err) {
                return res.status(500).json({ error: 'Error checking existing alias' });
            }

            if (existingAlias) {
                return res.status(409).json({ error: 'This alias is already registered by the user' });
            }

            
            const insertQuery = `
                INSERT INTO accounts_identifiers (ownerID, alias, accountNumber, uuid)
                VALUES (?, ?, ?, ?)
            `;

            db.run(insertQuery, [userID, alias, accountNumber, accountUUID], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Error registering alias' });
                }

                res.status(201).json({
                    message: 'Alias successfully registered',
                    uuid: accountUUID
                });
            });
        });
    });
};


const getSavedRecipients = (req, res) => {
    const { userID } = req.query;

    if (!userID) return res.status(400).json({ error: 'Missing parameters in the request' });

    const query = `
        SELECT alias, uuid FROM accounts_identifiers 
        WHERE ownerID = ?
    `;

    db.all(query, [userID], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error retrieving recipients' });
        return res.json(rows);
    });
};


module.exports = { registerAlias, getSavedRecipients, transferFundsUUID };
