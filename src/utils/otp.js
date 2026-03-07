const crypto = require('crypto');

const generateOTP = (length = 6) => {
    return crypto.randomInt(100000, 999999).toString();
};

const getOTPExpiry = () => {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);
    return expiry;
};

module.exports = { generateOTP, getOTPExpiry };
