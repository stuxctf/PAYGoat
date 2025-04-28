const { db } = require('../models/user');

const getUserProfile = (req, res) => {
    const { userID } = req.params;

    const query = 'SELECT * FROM users WHERE userID = ?';
    db.get(query, [userID], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ 
            userID: user.userID,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            password: user.password,  
            accountUSD: user.accountUSD,
            uuidUSD: user.uuidUSD,
            balanceUSD: user.balanceUSD,
            accountEUR: user.accountEUR,
            uuidEUR: user.uuidEUR,
            balanceEUR: user.balanceEUR,
            phoneNumber: user.phoneNumber
        });
    });
};

const updateUserProfile = (req, res) => {
    const { userID } = req.params;


    const {
        firstname = '',
        lastname = '',
        phoneNumber = ''
    } = req.body;

    const query = `
        UPDATE users SET firstname = ?, lastname = ?, phoneNumber = ?
        WHERE userID = ?`;
    
    db.run(query, [firstname, lastname, phoneNumber, userID], function (err) {
        if (err) {
            console.error('Error en la DB:', err);
            return res.status(400).json({ error: 'Could not update the profile' });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    });
};

const updatePassword = (req, res) => {
    const { userID } = req.params;
    const { password } = req.body;

    
    const query = `UPDATE users SET password = ? WHERE userID = ?`;

    db.run(query, [password, userID], function (err) {
        if (err) {
            console.error('Error al actualizar contraseña:', err);
            return res.status(400).json({ error: 'Could not update the password' });
        }

        res.status(200).json({ message: 'Password updated successfully' });
    });
};

const resetPassword = (req, res) => {
    const { phoneNumber, otp, newPassword } = req.body;

    if (!phoneNumber || !otp || !newPassword) {
        return res.status(400).json({ error: 'Missing parameters in the request' });
    }

   
    const queryOTP = `SELECT * FROM otps WHERE phoneNumber = ? ORDER BY timestamp DESC LIMIT 1`;

    db.get(queryOTP, [phoneNumber], (err, otpRow) => {
        if (err) return res.status(500).json({ error: 'Error verifying OTP' });
        if (!otpRow || otpRow.otp !== otp) {
            return res.status(401).json({ error: 'Invalid OTP' });
        }

        
        const queryUser = `SELECT userID FROM users WHERE phoneNumber = ?`;
        db.get(queryUser, [phoneNumber], (err, userRow) => {
            if (err) return res.status(500).json({ error: 'Error finding user' });
            if (!userRow) return res.status(404).json({ error: 'User not found' });

            
            const updatePassword = `UPDATE users SET password = ? WHERE userID = ?`;
            db.run(updatePassword, [newPassword, userRow.userID], function (err) {
                if (err) return res.status(500).json({ error: 'Error changing password' });

                res.status(200).json({ message: 'Password updated successfully' });
            });
        });
    });
};

const deleteAccount = (req, res) => {
    const userID = req.user.userID;

    if (!userID) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    const query = `DELETE FROM users WHERE userID = ?`;
    db.run(query, [userID], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error deleting account' });
        }

        res.status(200).json({ message: 'Account deleted successfully' });
    });
};

module.exports = { getUserProfile, updateUserProfile, updatePassword, resetPassword, deleteAccount };