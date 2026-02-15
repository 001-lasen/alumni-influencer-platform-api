const logger = require('../../utils/logger');
const logVar = 'Services | createUserService | ';

module.exports = function buildCreateUserService(usersRepository) {
    return Object.freeze({
        createUser,
        validateEmail
    });

    async function createUser(email, password) {
        logger.info(logVar + 'In createUser service');

        logger.info(logVar + 'Validating email');
        validateEmail(email);

        try {
            const result = await usersRepository.createUser(email, password);
            logger.info(logVar + 'User creation successful in service');
            return result;
        } catch (error) {
            logger.error(logVar + 'Error in createUser service: ' + error.message);
            throw new Error(error.message);
        }
    }

    function validateEmail(email) {
        logger.info(logVar + 'Validating email format');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            logger.warn(logVar + 'Invalid email format: ' + email);
            throw new Error('Invalid email format');
        }
        logger.info(logVar + 'Email format is valid');
    }
}
