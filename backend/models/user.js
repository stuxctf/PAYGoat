const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/paygoat.db');

/* =========================
   USERS
   ========================= */
const createUsersTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            userID INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            password TEXT NOT NULL,

            userType INTEGER DEFAULT 1, -- 1 PERSONAL | 2 BUSINESS

            accountUSD TEXT NOT NULL,
            uuidUSD TEXT NOT NULL,
            balanceUSD REAL DEFAULT 100,

            accountEUR TEXT NOT NULL,
            uuidEUR TEXT NOT NULL,
            balanceEUR REAL DEFAULT 0,

            creditCard TEXT NOT NULL,
            creditCardCVV TEXT NOT NULL,
            creditCardExpMonth TEXT NOT NULL,
            creditCardExpYear TEXT NOT NULL,
            phoneNumber TEXT NOT NULL
        );
    `;
    db.run(query);
};

const createUsersBusinessTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS business_users (
            businessUserID INTEGER PRIMARY KEY AUTOINCREMENT,

            companyID INTEGER NOT NULL,

            username TEXT NOT NULL UNIQUE,
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            password TEXT NOT NULL,

            role TEXT NOT NULL CHECK (role IN ('OWNER', 'FINANCE', 'AUDITOR')),

            -- SOLO OWNER tiene todo
            accountUSD TEXT,
            uuidUSD TEXT,
            balanceUSD REAL,

            accountEUR TEXT,
            uuidEUR TEXT,
            balanceEUR REAL,

            creditCard TEXT,
            creditCardCVV TEXT,
            creditCardExpMonth TEXT,
            creditCardExpYear TEXT,

            phoneNumber TEXT NOT NULL,

            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.run(query);
};



/* =========================
   COMPANIES
   ========================= */
const createCompaniesTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS companies (
            companyID INTEGER PRIMARY KEY AUTOINCREMENT,
            companyName TEXT NOT NULL,
            ownerID INTEGER NOT NULL, -- userID (userType = 2)
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.run(query);
};

/* =========================
   COMPANY USERS / ROLES
   ========================= */
const createCompanyUsersTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS company_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            companyID INTEGER NOT NULL,
            userID INTEGER NOT NULL,
            role TEXT NOT NULL, 
            -- OWNER | ADMIN | FINANCE | EMPLOYEE | AUDITOR

            transferLimit REAL DEFAULT 1000,

            UNIQUE(companyID, userID)
        );
    `;
    db.run(query);
};

/* =========================
   BUSINESS ACCOUNTS
   ========================= */
const createBusinessAccountsTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS business_accounts (
            accountID INTEGER PRIMARY KEY AUTOINCREMENT,
            companyID INTEGER NOT NULL,
            currency TEXT NOT NULL, -- USD | EUR
            accountNumber TEXT NOT NULL,
            uuid TEXT NOT NULL,
            balance REAL DEFAULT 10000
        );
    `;
    db.run(query);
};


/* =========================
   ACCOUNT IDENTIFIERS
   ========================= */
const createAccountIdentifiersTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS accounts_identifiers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ownerID INTEGER NOT NULL,
            accountType TEXT NOT NULL, -- personal | business
            alias TEXT,
            accountNumber TEXT NOT NULL,
            uuid TEXT NOT NULL,
            UNIQUE(ownerID, alias)
        );
    `;
    db.run(query);
};

/* =========================
   APPROVALS
   ========================= */
const createApprovalsTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS approvals (
            approvalID INTEGER PRIMARY KEY AUTOINCREMENT,
            transferID INTEGER NOT NULL,
            approvedBy INTEGER NOT NULL,
            approvedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.run(query);
};

/* =========================
   AUDIT LOGS
   ========================= */
const createAuditLogsTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            companyID INTEGER NOT NULL,
            businessUserID INTEGER,
            action TEXT NOT NULL,
            target TEXT,
            details TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.run(query);
};

const initDatabase = () => {
    createUsersTable();
    createCompaniesTable();
    createCompanyUsersTable();
    createBusinessAccountsTable();
    createAccountIdentifiersTable();
    createApprovalsTable();
    createAuditLogsTable();
    createUsersBusinessTable();
};

initDatabase();

module.exports = { db };
