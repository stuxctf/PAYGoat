const { db } = require('../models/user');
const { createTransaction } = require('../models/transaction');

const transferttirdparties = (req, res) => {
    const {
        senderAccountNumber,
        recipientAccountNumber,
        amount
    } = req.body;

    if (!senderAccountNumber || !recipientAccountNumber || !amount) {
        return res.status(400).json({ error: 'Missing parameters in the request' });
    }

    
    const currency = senderAccountNumber.startsWith('USD') ? 'USD' : 'EUR';

    
    if (senderAccountNumber.startsWith('EUR') || currency === 'EUR') {
        return res.status(403).json({ error: 'Operación no soportada' });
    }

   
    const querySender = 'SELECT * FROM users WHERE accountUSD = ? OR accountEUR = ?';
    db.get(querySender, [senderAccountNumber, senderAccountNumber], (err, sender) => {
        if (err) return res.status(500).json({ error: 'Error finding sender' });
        if (!sender) return res.status(404).json({ error: 'Sender not found' });

        
        const queryRecipient = 'SELECT * FROM users WHERE accountUSD = ? OR accountEUR = ?';
        db.get(queryRecipient, [recipientAccountNumber, recipientAccountNumber], (err, recipient) => {
            if (err) return res.status(500).json({ error: 'Error finding recipient' });
            if (!recipient) return res.status(404).json({ error: 'Recipient not found' });

            
            const senderBalance = currency === 'USD' ? sender.balanceUSD : sender.balanceEUR;
            if (senderBalance < amount) {
                return res.status(400).json({ error: 'Insufficient funds' });
            }

            
            const newSenderBalanceUSD = currency === 'USD' ? sender.balanceUSD - amount : sender.balanceUSD;
            const newSenderBalanceEUR = currency === 'EUR' ? sender.balanceEUR - amount : sender.balanceEUR;

            const newRecipientBalanceUSD = currency === 'USD' ? recipient.balanceUSD + amount : recipient.balanceUSD;
            const newRecipientBalanceEUR = currency === 'EUR' ? recipient.balanceEUR + amount : recipient.balanceEUR;

           
            const updateSender = `UPDATE users SET balanceUSD = ?, balanceEUR = ? WHERE userID = ?`;
            db.run(updateSender, [newSenderBalanceUSD, newSenderBalanceEUR, sender.userID], function (err) {
                if (err) return res.status(500).json({ error: 'Error updating senders balance' });

                
                const updateRecipient = `UPDATE users SET balanceUSD = ?, balanceEUR = ? WHERE userID = ?`;
                db.run(updateRecipient, [newRecipientBalanceUSD, newRecipientBalanceEUR, recipient.userID], function (err) {
                    if (err) return res.status(500).json({ error: 'Error updating recipients balance' });

                    
                    createTransaction(
                        sender.userID,
                        recipient.userID,
                        amount,
                        currency,
                        currency,
                        1 
                    );

                    return res.status(200).json({ message: 'Transfer successful' });
                });
            });
        });
    });
};



const transferFunds = (req, res) => {
    const {
        senderAccountNumber,
        recipientAccountNumber,
        amount,
        currencyFrom,
        currencyTo,
        rate
    } = req.body;

    if (!senderAccountNumber || !recipientAccountNumber || !amount || !currencyFrom || !currencyTo || !rate) {
        return res.status(400).json({ error: 'Missing parameters in the request' });
    }

    
    if (senderAccountNumber.startsWith('EUR') || currencyFrom.startsWith('EUR')) {
        return res.status(403).json({ error: 'Operation not allowed if the senders account or source currency starts with EUR' });
    }

    const queryUser = 'SELECT * FROM users WHERE accountUSD = ? OR accountEUR = ?';

    
    db.get(queryUser, [senderAccountNumber, senderAccountNumber], (err, sender) => {
        if (err) return res.status(500).json({ error: 'Error finding sender' });
        if (!sender) return res.status(404).json({ error: 'Sender not found' });

        
        db.get(queryUser, [recipientAccountNumber, recipientAccountNumber], (err, recipient) => {
            if (err) return res.status(500).json({ error: 'Error finding recipient' });
            if (!recipient) return res.status(404).json({ error: 'Recipient not found' });

            const senderBalance = currencyFrom === 'USD' ? sender.balanceUSD : sender.balanceEUR;
            if (senderBalance < amount) {
                return res.status(400).json({ error: 'Insufficient funds' });
            }

            let amountConverted = amount;
            if (currencyFrom === 'USD' && currencyTo === 'EUR') {
                amountConverted = amount * rate;
            }

            const newSenderBalanceUSD = currencyFrom === 'USD' ? sender.balanceUSD - amount : sender.balanceUSD;
            const newSenderBalanceEUR = currencyFrom === 'EUR' ? sender.balanceEUR - amount : sender.balanceEUR;

            const newRecipientBalanceUSD = currencyTo === 'USD' ? recipient.balanceUSD + amountConverted : recipient.balanceUSD;
            const newRecipientBalanceEUR = currencyTo === 'EUR' ? recipient.balanceEUR + amountConverted : recipient.balanceEUR;

            if (sender.userID === recipient.userID) {
                
                const updateSameUser = `UPDATE users SET balanceUSD = ?, balanceEUR = ? WHERE accountUSD = ? OR accountEUR = ?`;
                db.run(updateSameUser, [newSenderBalanceUSD, newRecipientBalanceEUR, senderAccountNumber, senderAccountNumber], function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Error updating balance' });
                    }

                    createTransaction(
                        sender.userID,
                        recipient.userID,
                        amount,
                        currencyFrom,
                        currencyTo,
                        rate
                    );

                    return res.status(200).json({ message: 'Transfer successful' });
                });
            } else {
                
                const updateSender = `UPDATE users SET balanceUSD = ?, balanceEUR = ? WHERE accountUSD = ? OR accountEUR = ?`;
                db.run(updateSender, [newSenderBalanceUSD, newSenderBalanceEUR, senderAccountNumber, senderAccountNumber], function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Error updating balance' });
                    }

                    
                    const updateRecipient = `UPDATE users SET balanceUSD = ?, balanceEUR = ? WHERE accountUSD = ? OR accountEUR = ?`;
                    db.run(updateRecipient, [newRecipientBalanceUSD, newRecipientBalanceEUR, recipientAccountNumber, recipientAccountNumber], function (err) {
                        if (err) {
                            return res.status(500).json({ error: 'Error updating balance' });
                        }

                        createTransaction(
                            sender.userID,
                            recipient.userID,
                            amount,
                            currencyFrom,
                            currencyTo,
                            rate
                        );

                        return res.status(200).json({ message: 'Transfer successful' });
                    });
                });
            }
        });
    });
};

module.exports = { transferFunds, transferttirdparties };
