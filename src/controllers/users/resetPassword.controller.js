const logger = require('../../utils/logger');
const logVar = 'Controller | resetPasswordController | ';

module.exports = function buildResetPasswordController(forgotPasswordService) {
    return async function handleResetPasswordRequest(httpRequest) {
        logger.info(logVar + 'In resetPassword controller');

        const headers = {'Content-Type': 'application/json'};
        const {email, newPassword} = httpRequest.body;

        if (!email || !newPassword) {
            return {
                headers,
                statusCode: 400,
                body: {
                    message: 'Email and new password are required'
                }
            };
        }

        try {
            const data = await forgotPasswordService.resetPassword(email, newPassword);
            return {
                headers,
                statusCode: 200,
                body: {
                    message: data.message
                }
            };
        } catch (error) {
            logger.error(logVar + 'Error: ' + error.message);
            return {
                headers,
                statusCode: 500,
                body: {
                    message: error.message
                }
            };
        }
    };
};
