const logger = require('../../utils/logger');
const logVar = 'Controller | createUserController | ';

module.exports = function buildCreateUserController(createUserService) {
    return async function handleCreateUserRequest(httpRequest) {
        logger.info(logVar + 'In createUser controller');

        const headers = {
            'Content-Type': 'application/json'
        }

        let data = {};

        let userEmail = httpRequest.body.email;
        let hashedPassword = httpRequest.body.password;

        if (!userEmail || !hashedPassword) {
            data.statusCode = 400;
            data.message = 'Email and password are required';
            logger.warn(logVar + 'Missing email or password in request body');
            return {
                headers,
                statusCode: data.statusCode,
                body: data.message
            }
        }

        logger.info(logVar + 'Creating user with email: ' + userEmail);

        try {
            data = await createUserService.createUser(userEmail, hashedPassword);
            logger.info(logVar + 'User created successfully');
            return {
                headers,
                statusCode: data.statusCode,
                body: data.message
            }
        } catch (error) {
            logger.error(logVar + 'Error creating user: ' + error.message);
            return {
                headers,
                statusCode: 500,
                body: error.message
            }
        }
    }
}
