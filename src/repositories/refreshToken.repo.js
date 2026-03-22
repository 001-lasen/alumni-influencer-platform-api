const logger = require('../utils/logger');
const refreshTokens = require("../models/refreshToken");
const logVar = ' Repositories | refreshToken.repo | ';

module.exports = function buildRefreshTokenRepository(models) {
    return Object.freeze({
        saveRefreshToken,
        findRefreshToken,
        revokeRefreshToken,
        revokeAllUserTokens
    });

    async function saveRefreshToken(userId, token, expiresAt) {
        logger.info(logVar + 'Saving refresh token for userId: ' + userId);
        return await models.refreshTokens.create({ userId, token, expiresAt });
    }

    async function findRefreshToken(token) {
        logger.info(logVar + 'Finding refresh token');
        return await models.refreshTokens.findOne({ where: { token, isRevoked: false } });
    }

    async function revokeRefreshToken(token) {
        logger.info(logVar + 'Revoking refresh token');
        return await models.refreshTokens.update(
            { isRevoked: true },
            { where: { token } }
        );
    }

    async function revokeAllUserTokens(userId) {
        logger.info(logVar + 'Revoking all tokens for userId: ' + userId);
        return await models.refreshTokens.update(
            { isRevoked: true },
            { where: { userId, isRevoked: false } }
        );
    }
}
