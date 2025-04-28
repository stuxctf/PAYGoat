const { db } = require('../models/user');
const { faker } = require('@faker-js/faker');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const SECRET_KEY = "SECRET"; 

const register = (req, res) => {
    const { firstname, lastname, username, password } = req.body;

    
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
            username, firstname, lastname, password, 
            accountUSD, uuidUSD, balanceUSD, accountEUR, uuidEUR, balanceEUR, 
            creditCard, phoneNumber, creditCardCVV, 
            creditCardExpMonth, creditCardExpYear
        ) 
        VALUES (?, ?, ?, ?, ?, ?, 100, ?, ?, 0, ?, ?, ?, ?, ?)
    `;

    db.run(queryUser, [
        username, firstname, lastname, password,
        accountUSD, uuidUSD, accountEUR, uuidEUR, creditCard, phoneNumber,
        cvv, expMonth, expYear
    ], function (err) {
        if (err) {
            console.error("Error de SQLite:", err.message);
            return res.status(400).json({ error: 'User registration failed', details: err.message });
        }

        const userID = this.lastID;
        res.status(201).json({ message: 'User registered successfully', userID });
    });
};


const login = (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });

        if (user.password !== password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        
        const token = jwt.sign(
            { userID: user.userID, username: user.username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token, userID: user.userID });
    });
};

module.exports = { register, login };
