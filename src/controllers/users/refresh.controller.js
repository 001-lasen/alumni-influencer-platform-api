const logger = require('../../utils/logger');
const logVar = ' Controller | refreshController | ';

module.exports = function buildRefreshController(refreshService) {
    return async function handleRefreshRequest(httpRequest) {
        logger.info(logVar + 'In refresh controller');

        const headers = { 'Content-Type': 'application/json' };
        const refreshToken = httpRequest.cookies?.refreshToken;

        try {
            const data = await refreshService.refreshAccessToken(refreshToken);
            logger.info(logVar + 'Access token refreshed successfully');
            return {
                headers,
                statusCode: 200,
                body: { accessToken: data.accessToken }
            };
        } catch (error) {
            logger.error(logVar + 'Error refreshing token: ' + error.message);
            return {
                headers,
                statusCode: 401,
                body: { message: error.message }
            };
        }
    };
};
