const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/paygoat.db');

const createOTP = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS otps (
            userID INTEGER,
            phoneNumber TEXT,
            otp TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.run(query);
};

createOTP();

module.exports = { createOTP, db };