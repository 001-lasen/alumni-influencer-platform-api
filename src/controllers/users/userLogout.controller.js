const logger = require('../../utils/logger');
const logVar = ' Controller | logoutController | ';

module.exports = function buildUserLogoutController(logoutService) {
    return async function handleUserLogoutRequest(httpRequest) {
        logger.info(logVar + 'In logout controller');

        const headers = { 'Content-Type': 'application/json' };
        const refreshToken = httpRequest.cookies?.refreshToken;
        const authHeader = httpRequest.headers?.Authorization;
        const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        try {
            await logoutService.logoutUser(refreshToken, accessToken);
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
