const logger = require('../../utils/logger');
const logVar = 'Controller | hashPasswordController | ';

module.exports = function buildHashDataController(hashDataService) {
    return async function hashPasswordController(httpRequest) {
        logger.info(logVar + 'In hashPassword controller');

        const headers = {
            'Content-Type': 'application/json'
        }

        let password = httpRequest.body.password;

        if (!password) {
            logger.warn(logVar + 'Missing password in request body');
            return {
                headers,
                statusCode: 400,
                body: 'Password is required'
            }
        }

        logger.info(logVar + 'Hashing password');
        try {
            const hashedPassword = await hashDataService.hashData(password);
            logger.info(logVar + 'Password hashed successfully');
            return {
                headers,
                statusCode: 200,
                body: { hashedPassword }
            }
        } catch (error) {
            logger.error(logVar + 'Error hashing password: ' + error.message);
            return {
                headers,
                statusCode: 500,
                body: error.message
            }
        }
    }
}
