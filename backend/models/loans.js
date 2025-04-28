const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/paygoat.db');

const createLoan = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS loans (
            loanID INTEGER PRIMARY KEY AUTOINCREMENT,
            userID INTEGER,
            amount REAL,
            status TEXT DEFAULT 'approved',
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userID) REFERENCES users(userID)
        );
    `;
    db.run(query);
};

createLoan();

module.exports = { createLoan, db };