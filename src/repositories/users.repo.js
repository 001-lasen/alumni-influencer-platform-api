const logger = require('../utils/logger');
const logVar = 'Repositories | users.repo | ';

module.exports = function buildUsersRepository(models) {
    return Object.freeze({
        createUser,
        findUserByEmail
    });

    async function createUser(email, password) {
        logger.info(`${logVar}In createUser repository`);

        try {
            const existingUser = await models.users.findOne({
                where: { email: email }
            })
            if (existingUser) {
                logger.warn(`${logVar}User with email ${email} already exists`);
                throw new Error('User with this email already exists');
            }

            const user = await models.users.create({
                email: email,
                passwordHash: password
            });
            logger.info(logVar + 'User created successfully in repository with email: ' + user.email);

            return {
                statusCode: 201,
                message: 'User created successfully'
            };
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

