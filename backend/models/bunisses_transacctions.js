const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/paygoat.db');

const createPaymentBatchesTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS company_transfer_batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batchID INTEGER UNIQUE NOT NULL,   -- Nuevo campo numérico externo
      companyID INTEGER NOT NULL,
      createdBy INTEGER NOT NULL,
      currency TEXT,
      status TEXT DEFAULT 'PENDING',     -- PENDING | APPROVED | DECLINED
      totalAmount REAL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.run(query);
};


const createPaymentBatchItemsTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS company_transfer_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batchID INTEGER NOT NULL,
      targetAccount TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.run(query);
};

const initDatabase = () => {
    createPaymentBatchesTable();
    createPaymentBatchItemsTable();
};

initDatabase();

module.exports = { db };
