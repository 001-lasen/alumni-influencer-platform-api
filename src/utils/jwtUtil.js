const jwt = require('jsonwebtoken');
const {
    JWT_SECRET,
    JWT_EXPIRATION,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRATION
} = require('./constants');

module.exports = {
    generateAccessToken(payload) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    },

    generateRefreshToken(payload) {
        return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });
    },

    verifyAccessToken(token) {
        return jwt.verify(token, JWT_SECRET);
    },

    verifyRefreshToken(token) {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    },
};
