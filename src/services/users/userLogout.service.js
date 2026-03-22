const logger = require('../../utils/logger');
const logVar = ' Services | logoutService | ';
const jwtUtil = require('../../utils/jwtUtil');

module.exports = function buildUserLogoutService(refreshTokenRepository, tokenBlacklistRepository) {
    return Object.freeze({
        logoutUser
    });

    async function logoutUser(refreshToken, accessToken) {
        logger.info(logVar + 'In logoutUser service');

        if (refreshToken) {
            await refreshTokenRepository.revokeRefreshToken(refreshToken);
            logger.info(logVar + 'Refresh token revoked successfully');
        }

        if (accessToken) {
            const decoded = jwtUtil.decodeToken(accessToken);
            if (decoded?.exp) {
                const expiresAt = new Date(decoded.exp * 1000);
                await tokenBlacklistRepository.blacklistToken(accessToken, expiresAt);
                logger.info(logVar + 'Access token blacklisted');
            }
        }

        return { statusCode: 200, message: 'Logged out successfully' };
    }
}
