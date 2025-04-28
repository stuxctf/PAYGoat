const { db } = require('../models/user');
const { decrypt, encrypt } = require('../utils/crypto');

const getCreditCard = (req, res) => {
    const { encryptedData } = req.body;

    if (!encryptedData) {
        return res.status(400).json({ error: 'Missing parameters in the request' });
    }

    try {
        const decryptedUserID = decrypt(encryptedData);

        if (!decryptedUserID) {
            return res.status(400).json({ error: 'Decrypted UserID is invalid' });
        }

        const query = `
            SELECT 
                creditCard,
                creditCardCVV,
                creditCardExpMonth,
                creditCardExpYear
            FROM users 
            WHERE userID = ?
        `;

        db.get(query, [decryptedUserID], (err, user) => {
            if (err || !user) {
                return res.status(404).json({ error: 'User not found or database error' });
            }

            const creditCardInfo = {
                creditCard: user.creditCard,
                creditCardCVV: user.creditCardCVV,
                creditCardExpMonth: user.creditCardExpMonth,
                creditCardExpYear: user.creditCardExpYear
            };

            const encryptedResponse = encrypt(JSON.stringify(creditCardInfo));

            res.status(200).json({ encryptedData: encryptedResponse });
        });
    } catch (err) {
        console.error(err); 
        return res.status(500).json({ error: 'Error decrypting or processing the data' });
    }
};

module.exports = { getCreditCard };