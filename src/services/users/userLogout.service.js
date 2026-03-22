const logger = require('../../utils/logger');
const logVar = ' Services | logoutService | ';

module.exports = function buildUserLogoutService(refreshTokenRepository) {
    return Object.freeze({ logoutUser });

    async function logoutUser(refreshToken) {
        logger.info(logVar + 'In logoutUser service');

        if (refreshToken) {
            await refreshTokenRepository.revokeRefreshToken(refreshToken);
            logger.info(logVar + 'Refresh token revoked successfully');
        }

        return { statusCode: 200, message: 'Logged out successfully' };
    }
}
