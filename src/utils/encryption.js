const bcrypt = require('bcrypt');
const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS);

const encryptionUtil = {
    hash: async (plainTextPassword) => {
        return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
    },

    compare: async (plainTextPassword, hash) => {
        return bcrypt.compare(plainTextPassword, hash);
    }
};

module.exports = encryptionUtil;
