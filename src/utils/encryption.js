const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

const passwordUtil = {
    /**
     * Hash a plain text password (for Registration)
     */
    hash: async (plainTextPassword) => {
        return await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
    },

    /**
     * Compare plain text with a stored hash (for Login)
     */
    compare: async (plainTextPassword, hash) => {
        return await bcrypt.compare(plainTextPassword, hash);
    }
};

module.exports = passwordUtil;
