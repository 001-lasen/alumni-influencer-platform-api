const logger = require('../../utils/logger');
const logVar = 'Services | createUserService | ';
const enums = require('../../utils/enums');

module.exports = function buildCreateUserService(usersRepository) {
    return Object.freeze({
        createUser,
        validateEmail,
        validateUserType
    });

    async function createUser(email, password, userType) {
        logger.info(logVar + 'In createUser service');

        logger.info(logVar + 'Validating email');
        validateEmail(email);

        validateUserType(userType);

        try {
            logger.info(logVar + 'Creating user');
            const result = await usersRepository.createUser(email, password, userType);

            logger.info(logVar + 'Assigning default role to user');
            await
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

    function validateUserType(userType) {
        logger.info(logVar + 'Validating user type');

        if (!enums.UserTypes[userType]) {
            logger.error(logVar + 'Invalid user type: ' + userType);
            throw new Error('Invalid user type');
        }
        logger.info(logVar + 'User type is valid');
    }
}
