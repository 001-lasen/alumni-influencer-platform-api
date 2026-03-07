const encryptionUtil = require('../../utils/encryption');
const logger = require('../../utils/logger');
const logVar = 'Services | hashPasswordService | ';

module.exports = function buildHashPasswordService() {
    return Object.freeze({
        hashPassword
    });

    async function hashPassword(password) {
        logger.info(logVar + 'In hashPassword service');
        return encryptionUtil.hash(password);
    }
}
