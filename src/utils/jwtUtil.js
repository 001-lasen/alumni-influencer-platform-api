const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRATION} = require('./constants');

module.exports = {
    generateToken(payload) {
        return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRATION});
    },

    verifyToken(token) {
        return jwt.verify(token, JWT_SECRET);
    },
}
