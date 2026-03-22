const logger = require('../../utils/logger');
const logVar = 'Controller | verifyForgotPasswordOTPController | ';

module.exports = function buildVerifyForgotPasswordOTPController(forgotPasswordService) {
    return async function handleVerifyForgotPasswordOTPRequest(httpRequest) {
        logger.info(logVar + 'In verifyForgotPasswordOTP controller');

        const headers = {'Content-Type': 'application/json'};
        const {email, otp} = httpRequest.body;

        if (!email || !otp) {
            return {
                headers,
                statusCode: 400,
                body: {
                    message: 'Email and OTP are required'
                }
            };
        }

        try {
            const data = await forgotPasswordService.verifyForgotPasswordOTP(email, otp);
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
