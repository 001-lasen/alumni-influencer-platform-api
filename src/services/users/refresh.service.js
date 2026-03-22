const jwtUtil = require('../../utils/jwtUtil');
const logger = require('../../utils/logger');
const logVar = ' Services | refreshService | ';

module.exports = function buildRefreshService(refreshTokenRepository, userRolesRepository) {
    return Object.freeze({
        refreshAccessToken
    });

    async function refreshAccessToken(refreshToken) {
        logger.info(logVar + 'In refreshAccessToken service');

        if (!refreshToken) {
            throw new Error('No refresh token provided');
        }

        let decoded;
        try {
            decoded = jwtUtil.verifyRefreshToken(refreshToken);
        } catch (error) {
            logger.warn(logVar + 'Invalid or expired refresh token');
            throw new Error('Invalid or expired refresh token');
        }

        const storedToken = await refreshTokenRepository.findRefreshToken(refreshToken);
        if (!storedToken) {
            logger.warn(logVar + 'Refresh token not found or revoked');
            throw new Error('Invalid or expired refresh token');
        }

        if (storedToken.expiresAt < new Date()) {
            logger.warn(logVar + 'Refresh token expired for userId: ' + decoded.userId);
            throw new Error('Refresh token has expired, please log in again');
        }

        const userRoles = await userRolesRepository.getUserRoleIds(decoded.userId);
        const payload = { userId: decoded.userId, roles: userRoles };
        const accessToken = jwtUtil.generateAccessToken(payload);

        logger.info(logVar + 'New access token issued for userId: ' + decoded.userId);
        return {
            statusCode: 200,
            accessToken
        };
    }
}
