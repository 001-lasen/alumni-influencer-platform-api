const logger = require('../../utils/logger');
const logVar = 'Controller | userLoginController | ';

module.exports = function buildUserLoginController(userLoginService) {
    return async function handleUserLoginRequest(httpRequest) {
        logger.info(logVar + 'In userLogin controller');

        const headers = {
            'Content-Type': 'application/json'
        }

        let userEmail = httpRequest.body.email;
        let userPassword = httpRequest.body.password;

        if (!userEmail || !userPassword) {
            logger.warn(logVar + 'Missing email or password in request body');
            return {
                headers,
                statusCode: 400,
                body: { message: 'Email and password are required' }
            }
        }

        logger.info(logVar + 'Attempting to log in user with email: ' + userEmail);
        try {
            const data = await userLoginService.loginUser(userEmail, userPassword);
            logger.info(logVar + 'User logged in successfully');
            return {
                headers,
                statusCode: 200,
                cookies: {
                    refreshToken: {
                        value: data.refreshToken,
                        options: {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 7 * 24 * 60 * 60 * 1000,
                        }
                    }
                },
                body: {
                    status: data.status,
                    accessToken: data.accessToken,
                }
            };
        } catch (error) {
            logger.error(logVar + 'Error logging in user: ' + error.message);
            return {
                headers,
                statusCode: 401,
                body: { message: error.message }
            }
        }
    }
}
