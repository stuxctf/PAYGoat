const { db } = require('../models/otps');
const generateOTP = require('../utils/otpGenerator');

const sendOTP = (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number required'});
    }

    const otp = generateOTP();

    const queryUser = `SELECT userID FROM users WHERE phoneNumber = ?`;
    db.get(queryUser, [phoneNumber], (err, user) => {
        if (err) return res.status(500).json({ error: 'Error finding user' });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const insertOTP = `INSERT INTO otps (userID, phoneNumber, otp) VALUES (?, ?, ?)`;
        db.run(insertOTP, [user.userID, phoneNumber, otp], function (err) {
            if (err) return res.status(500).json({ error: 'Error saving OTP' });

            return res.status(200).json({
                message: 'OTP generated successfully',
                otp
            });
        });
    });
};

module.exports = sendOTP;
