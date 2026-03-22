const logger = require('../../utils/logger');
const logVar = 'Controller | resendOTPController | ';

module.exports = function buildResendOTPController(verifyEmailService) {
    return async function handleResendOTPRequest(httpRequest) {
        logger.info(logVar + 'In resendOTP controller');

        const headers = {
            'Content-Type': 'application/json'
        }

        let data = {};
        let userEmail = httpRequest.body.email;

        if (!userEmail) {
            data.statusCode = 400;
            data.message = 'Email is required';
            logger.warn(logVar + 'Missing email in request body');
            return {
                headers,
                statusCode: data.statusCode,
                body: data.message
            }
        }

        logger.info(logVar + 'Attempting to resend OTP to email: ' + userEmail);
        try {
            data = await verifyEmailService.resendOTP(userEmail);
            logger.info(logVar + 'OTP resent successfully to email: ' + userEmail);
            return {
                headers,
                statusCode: 200,
                body: data.message
            }
        } catch (error) {
            logger.error(logVar + 'Error resending OTP: ' + error.message);
            return {
                headers,
                statusCode: 500,
                body: error.message
            }
        }
    }
}
