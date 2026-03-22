const logger = require('../../utils/logger');
const {log} = require("debug");
const logVar = 'Controller | verifyUserEmailController | ';

module.exports = function buildVerifyUserEmailController(verifyEmailService) {
    return async function handleVerifyUserEmail(httpRequest) {
        logger.info(logVar + 'In verifyUserEmailController');

        const headers = {
            'Content-Type': 'application/json'
        }

        let otp = httpRequest.body.otp;
        let email = httpRequest.body.email;

        if (!otp || !email) {
            logger.error(logVar + 'Missing required fields: otp or email');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields: otp or email' })
            }
        }

        logger.info(logVar + 'Attempting to verify email for: ' + email);
        try {
            const result = await verifyEmailService.verifyEmail(email, otp);
            logger.info(logVar + 'Email verification successful for: ' + email);
            return {
                headers,
                statusCode: 200,
                body: result.message
            }
        } catch (error) {
            logger.error(logVar + 'Error occurred while verifying user email: ' + error.message);
            return {
                headers,
                statusCode: 500,
                body: JSON.stringify({ error: error.message })
            }
        }
    }
}
