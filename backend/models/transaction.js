const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/paygoat.db');

const createTransactionTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS transactions (
            transactionID INTEGER PRIMARY KEY AUTOINCREMENT,
            senderID INTEGER,
            recipientID INTEGER,
            amount REAL,
            currencyFrom TEXT,
            currencyTo TEXT,
            rate REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (senderID) REFERENCES users(userID),
            FOREIGN KEY (recipientID) REFERENCES users(userID)
        );
    `;
    db.run(query);
};


const createTransaction = (senderID, recipientID, amount, currencyFrom, currencyTo, rate) => {
    const query = `INSERT INTO transactions (senderID, recipientID, amount, currencyFrom, currencyTo, rate) 
                   VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(query, [senderID, recipientID, amount, currencyFrom, currencyTo, rate], function (err) {
        if (err) {
            console.error(err);
        }
    });
};

createTransactionTable()

module.exports = { createTransactionTable, createTransaction, db };
