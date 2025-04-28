const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/paygoat.db');


const createUserTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            userID INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            password TEXT NOT NULL,
            accountUSD TEXT NOT NULL,
            uuidUSD TEXT NOT NULL,
            balanceUSD REAL DEFAULT 100,
            accountEUR TEXT NOT NULL,
            uuidEUR TEXT NOT NULL,
            balanceEUR REAL DEFAULT 0,
            creditCard TEXT NOT NULL,
            phoneNumber TEXT NOT NULL,
            creditCardCVV TEXT NOT NULL,
            creditCardExpMonth TEXT NOT NULL,
            creditCardExpYear TEXT NOT NULL
        );
    `;
    db.run(query);
};


const createUUID = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS accounts_identifiers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ownerID INTEGER NOT NULL,             
            alias TEXT,                           
            accountNumber TEXT NOT NULL,          
            uuid TEXT NOT NULL,
            UNIQUE(ownerID, alias)
        );
    `;
    db.run(query);
};


createUserTable();
createUUID();

module.exports = { db };
