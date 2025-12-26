const { db } = require('../models/user');
const { faker } = require('@faker-js/faker');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { addAuditLog } = require('../utils/logger');

const SECRET_KEY = "SECRET";

const register = (req, res) => {
    const {
        firstname,
        lastname,
        username,
        password,
        userType,
        company
    } = req.body;

    const finalUserType = userType === 2 ? 2 : 1;

    if (finalUserType === 2 && !company) {
        return res.status(400).json({
            error: 'Business users must be registered with a company'
        });
    }

    // 🔹 CREAR CUENTAS (UNA SOLA VEZ)
    const accountUSD = 'USD' + faker.finance.accountNumber();
    const accountEUR = 'EUR' + faker.finance.accountNumber();
    const uuidUSD = uuidv4();
    const uuidEUR = uuidv4();

    const creditCard = faker.finance.creditCardNumber();
    const phoneNumber = '+54' + faker.string.numeric(10);
    const cvv = faker.string.numeric({ length: 3 });
    const expMonth = faker.string.numeric({ length: 2, min: 1, max: 12 }).padStart(2, '0');
    const expYear = (2025 + Math.floor(Math.random() * 4)).toString();

    const queryUser = `
        INSERT INTO users (
            username, firstname, lastname, password, userType,
            accountUSD, uuidUSD, balanceUSD,
            accountEUR, uuidEUR, balanceEUR,
            creditCard, phoneNumber, creditCardCVV,
            creditCardExpMonth, creditCardExpYear
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 10000, ?, ?, 10000, ?, ?, ?, ?, ?)
    `;

    db.run(queryUser, [
        username,
        firstname,
        lastname,
        password,
        finalUserType,
        accountUSD,
        uuidUSD,
        accountEUR,
        uuidEUR,
        creditCard,
        phoneNumber,
        cvv,
        expMonth,
        expYear
    ], function (err) {
        if (err) {
            return res.status(400).json({
                error: 'User registration failed',
                details: err.message
            });
        }

        const userID = this.lastID;

        // ============================
        // 🏢 BUSINESS USER (OWNER)
        // ============================
        if (finalUserType === 2) {
            const { companyName } = company;

            db.run(
                `INSERT INTO companies (companyName, ownerID)
                 VALUES (?, ?)`,
                [companyName, userID],
                function (err2) {
                    if (err2) {
                        return res.status(500).json({
                            error: 'Company creation failed',
                            details: err2.message
                        });
                    }

                    const companyID = this.lastID;

                    // 🔹 RELACIÓN OWNER
                    db.run(
                        `INSERT INTO company_users (companyID, userID, role)
                         VALUES (?, ?, 'OWNER')`,
                        [companyID, userID]
                    );

                    // 🔥 CREAR CUENTAS EMPRESARIALES (MATCH CON OWNER)
                    const insertBusinessAccount = `
                        INSERT INTO business_accounts
                        (companyID, currency, accountNumber, uuid, balance)
                        VALUES (?, ?, ?, ?, ?)
                    `;

                    // USD
                    db.run(insertBusinessAccount, [
                        companyID,
                        'USD',
                        accountUSD,
                        uuidUSD,
                        10000
                    ]);

                    // EUR
                    db.run(insertBusinessAccount, [
                        companyID,
                        'EUR',
                        accountEUR,
                        uuidEUR,
                        10000
                    ]);

                    return res.status(201).json({
                        message: 'Business user registered',
                        userID,
                        companyID,
                        role: 'OWNER'
                    });
                }
            );
        } 
        // ============================
        // 👤 PERSONAL USER
        // ============================
        else {
            return res.status(201).json({
                message: 'Personal user registered',
                userID,
                userType: 1
            });
        }
    });
};

const login = (req, res) => {
    const { username, password } = req.body;

    
    db.get(
        'SELECT userID, username, password, userType FROM users WHERE username = ?',
        [username],
        (err, user) => {

            if (!user) {
                return db.get(
                    `
                    SELECT
                        businessUserID,
                        companyID,
                        username,
                        password,
                        role
                    FROM business_users
                    WHERE username = ?
                    `,
                    [username],
                    (err2, businessUser) => {
                        if (err2 || !businessUser) {
                            return res.status(404).json({ error: 'User not found' });
                        }

                        if (businessUser.password !== password) {
                            return res.status(401).json({ error: 'Incorrect password' });
                        }

                        const token = jwt.sign(
                            {
                                businessUserID: businessUser.businessUserID,
                                companyID: businessUser.companyID,
                                role: businessUser.role,
                                userType: 2
                            },
                            SECRET_KEY,
                            { expiresIn: '1h' }
                        );
                        addAuditLog(businessUser.companyID, businessUser.businessUserID, 'Login', null, `User ${username} logged in`);
                        return res.status(200).json({
                            message: 'Login successful',
                            token,
                            userType: 2,
                            businessUserID: businessUser.businessUserID,
                            companyID: businessUser.companyID,
                            role: businessUser.role
                        });
                    }
                );
            }

            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (user.password !== password) {
                return res.status(401).json({ error: 'Incorrect password' });
            }

            const token = jwt.sign(
                {
                    userID: user.userID,
                    username: user.username,
                    userType: user.userType
                },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            // 👤 USUARIO PERSONAL
            if (user.userType === 1) {
                return res.status(200).json({
                    message: 'Login successful',
                    token,
                    userID: user.userID,
                    userType: user.userType
                });
            }

            // 🏢 USUARIO EMPRESARIAL (users + company_users)
            db.get(
                `SELECT companyID, role FROM company_users WHERE userID = ?`,
                [user.userID],
                (err2, companyUser) => {
                    if (err2 || !companyUser) {
                        return res.status(500).json({
                            error: 'Company relationship not found'
                        });
                    }

                    return res.status(200).json({
                        message: 'Login successful',
                        token,
                        userID: user.userID,
                        userType: user.userType,
                        companyID: companyUser.companyID,
                        role: companyUser.role
                    });
                }
            );
        }
    );
};

module.exports = { register, login };
