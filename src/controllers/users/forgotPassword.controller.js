const logger = require('../../utils/logger');
const logVar = 'Controller | forgotPasswordController | ';

module.exports = function buildForgotPasswordController(forgotPasswordService) {
    return async function handleForgotPasswordRequest(httpRequest) {
        logger.info(logVar + 'In forgotPassword controller');

        const headers = {'Content-Type': 'application/json'};
        const {email} = httpRequest.body;

        if (!email) {
            return {
                headers,
                statusCode: 400,
                body: {
                    message: 'Email is required'
                }
            };
        }

        try {
            const data = await forgotPasswordService.forgotPassword(email);
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
                statusCode: 400,
                body: {
                    message: error.message
                }
            };
        }
    };
};
