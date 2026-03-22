const logger = require('../../utils/logger');
const logVar = ' Controller | logoutController | ';

module.exports = function buildUserLogoutController(logoutService) {
    return async function handleUserLogoutRequest(httpRequest) {
        logger.info(logVar + 'In logout controller');

        const headers = { 'Content-Type': 'application/json' };
        const refreshToken = httpRequest.cookies?.refreshToken;

        try {
            await logoutService.logoutUser(refreshToken);
            logger.info(logVar + 'User logged out successfully');
            return {
                headers,
                statusCode: 200,
                clearCookies: ['refreshToken'],
                body: { message: 'Logged out successfully' }
            };
        } catch (error) {
            logger.error(logVar + 'Error logging out: ' + error.message);
            return {
                headers,
                statusCode: 500,
                body: { message: error.message }
            };
        }
    };
};
