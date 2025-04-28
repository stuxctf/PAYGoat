const crypto = require('crypto');

const secretKey = Buffer.from('0123456789abcabcdefdef0123456789', 'utf8');
const iv = Buffer.from('abc9876543210def', 'utf8');

function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

function decrypt(encryptedBase64) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
    let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };
