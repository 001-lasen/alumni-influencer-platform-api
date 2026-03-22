const logger = require('../utils/logger');
const logVar = ' Repositories | tokenBlacklist.repo | ';

module.exports = function buildTokenBlacklistRepository(models) {
    return Object.freeze({
        blacklistToken,
        isTokenBlacklisted
    });

    async function blacklistToken(token, expiresAt) {
        logger.info(logVar + 'Blacklisting access token');
        return await models.tokenBlacklist.create({ token, expiresAt });
    }

    async function isTokenBlacklisted(token) {
        logger.info(logVar + 'Checking if token is blacklisted');
        const found = await models.tokenBlacklist.findOne({ where: { token } });
        return !!found;
    }
}
