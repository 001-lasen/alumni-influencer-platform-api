const logger = require('../../utils/logger');
const logVar = 'Controller | changePasswordController | ';

module.exports = function buildChangePasswordController(changePasswordService) {
    return async function handleChangePasswordRequest(httpRequest) {
        logger.info(logVar + 'In changePassword controller');

        const headers = { 'Content-Type': 'application/json' };
        const { currentPassword, newPassword } = httpRequest.body;
        const userId = httpRequest.user?.userId;

        if (!currentPassword || !newPassword) {
            logger.warn(logVar + 'Missing current or new password');
            return {
                headers,
                statusCode: 400,
                body: { message: 'Current password and new password are required' }
            };
        }

        try {
            const data = await changePasswordService.changePassword(userId, currentPassword, newPassword);
            logger.info(logVar + 'Password changed successfully for userId: ' + userId);
            return {
                headers,
                statusCode: 200,
                body: { message: data.message }
            };
        } catch (error) {
            logger.error(logVar + 'Error changing password: ' + error.message);
            return {
                headers,
                statusCode: 400,
                body: { message: error.message }
            };
        }
    };
};
