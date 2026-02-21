const logger = require('../../utils/logger');
const logVar = 'Controller | userLoginController | ';

module.exports = function buildUserLoginController(userLoginService) {
    return async function handleUserLoginRequest(httpRequest) {
        logger.info(logVar + 'In userLogin controller');

        const headers = {
            'Content-Type': 'application/json'
        }

        let data = {};
        let userEmail = httpRequest.body.email;
        let userPassword = httpRequest.body.password;

        if (!userEmail || !userPassword) {
            data.statusCode = 400;
            data.message = 'Email and password are required';
            logger.warn(logVar + 'Missing email or password in request body');
            return {
                headers,
                statusCode: data.statusCode,
                body: data.message
            }
        }

        logger.info(logVar + 'Attempting to log in user with email: ' + userEmail);
        try {
            data = await userLoginService.loginUser(userEmail, userPassword);
            logger.info(logVar + 'User logged in successfully');
            return {
                headers,
                statusCode: 200,
                body: data
            }
        } catch (error) {
            logger.error(logVar + 'Error logging in user: ' + error.message);
            return {
                headers,
                statusCode: 401,
                body: error.message
            }
        }
    }
}
