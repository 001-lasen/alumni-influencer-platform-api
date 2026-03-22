const encryptionUtil = require('../../utils/encryption');
const logger = require('../../utils/logger');
const logVar = 'Services | hashPasswordService | ';

module.exports = function buildHashDataService() {
    return Object.freeze({
        hashData
    });

    async function hashData(password) {
        logger.info(logVar + 'In hashPassword service');
        return encryptionUtil.hash(password);
    }
}
