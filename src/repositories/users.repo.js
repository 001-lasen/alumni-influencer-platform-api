const logger = require('../utils/logger');
const logVar = 'Repositories | users.repo | ';

module.exports = function buildUsersRepository(models) {
    return Object.freeze({
        createUser,
        findUserByEmail
    });

    async function createUser(email, password, userType) {
        logger.info(`${logVar}In createUser repository`);

        const cleanEmail = email.trim().toLowerCase();

        try {
            logger.info(logVar + 'Checking if user with email already exists');
            const existingUser = await models.users.findOne({
                where: { email: cleanEmail }
            })

            if (existingUser) {
                logger.warn(`${logVar}User with email ${cleanEmail} already exists`);
                throw new Error('User with this email already exists');
            }

            const user = await models.users.create({
                email: cleanEmail,
                passwordHash: password,
                userType: userType
            });
            logger.info(logVar + 'User created successfully in repository with email: ' + user.email);

            return user;
        } catch (error) {
            logger.error(`${logVar}Error: ${error.message}`);
            throw error;
        }
    }

    async function findUserByEmail(email) {
        logger.info(logVar + 'Finding user by email');

        try {
            const user = await models.users.findOne({
                where: { email: email }
            });
            logger.info(logVar + 'End of findUserByEmail repository');
            return user;
        } catch (error) {
            logger.error(logVar + 'Error finding user by email: ' + error.message);
            throw error;
        }
    }
}

