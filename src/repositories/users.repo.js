const logger = require('../utils/logger');
const logVar = 'Repositories | users.repo | ';

module.exports = function buildUsersRepository(models) {
    return Object.freeze({
        createUser,
        findUserByEmail,
        saveOTP,
        markEmailVerified,
        incrementOTPAttempts,
        findUserById,
        updatePassword
    });

    async function createUser(email, password, userType) {
        logger.info(`${logVar}In createUser repository`);

        const cleanEmail = email.trim().toLowerCase();

        try {
            logger.info(`${logVar}Checking if user with email already exists`);
            const existingUser = await models.users.findOne({
                where: {email: cleanEmail}
            });

            if (existingUser) {
                logger.warn(`${logVar}User with email ${cleanEmail} already exists`);
                throw new Error('User with this email already exists');
            }

            const user = await models.users.create({
                email: cleanEmail,
                passwordHash: password,
                userType: userType
            });
            logger.info(`${logVar}User created successfully in repository with email: ${user.email}`);

            return user;
        } catch (error) {
            logger.error(`${logVar}Error: ${error.message}`);
            throw error;
        }
    }

    async function findUserByEmail(email) {
        logger.info(`${logVar}In findUserByEmail repository`);

        const cleanEmail = email.trim().toLowerCase();

        try {
            const user = await models.users.findOne({
                where: {email: cleanEmail}
            });
            logger.info(`${logVar}End of findUserByEmail repository`);
            return user || null;
        } catch (error) {
            logger.error(`${logVar}Error finding user by email: ${error.message}`);
            throw error;
        }
    }

    async function saveOTP(userId, otpHash, expiry) {
        logger.info(`${logVar}Saving OTP for user ID: ${userId}`);

        try {
            await models.users.update(
                {
                    otp: otpHash,
                    otpExpiry: expiry,
                    otpAttempts: 0
                },
                {
                    where: {id: userId}
                }
            );
            logger.info(`${logVar}OTP saved successfully for user ID: ${userId}`);
        } catch (error) {
            logger.error(`${logVar}Error saving OTP: ${error.message}`);
            throw error;
        }
    }

    async function markEmailVerified(userId) {
        logger.info(`${logVar}Marking email as verified for user ID: ${userId}`);

        try {
            await models.users.update(
                {
                    isVerified: true,
                    otp: null,
                    otpExpiry: null,
                    otpAttempts: 0
                },
                {
                    where: {id: userId}
                }
            );
            logger.info(`${logVar}Email marked as verified for user ID: ${userId}`);
        } catch (error) {
            logger.error(`${logVar}Error marking email as verified: ${error.message}`);
            throw error;
        }
    }

    async function incrementOTPAttempts(userId) {
        logger.info(`${logVar}Incrementing OTP attempts for user ID: ${userId}`);

        try {
            await models.users.increment('otpAttempts', {
                where: {id: userId}
            });
            logger.info(`${logVar}OTP attempts incremented for user ID: ${userId}`);
        } catch (error) {
            logger.error(`${logVar}Error incrementing OTP attempts: ${error.message}`);
            throw error;
        }
    }

    async function findUserById(userId) {
        logger.info(logVar + 'Finding user by id: ' + userId);
        return await models.users.findOne({ where: { id: userId } });
    }

    async function updatePassword(userId, hashedPassword) {
        logger.info(logVar + 'Updating password for userId: ' + userId);
        return await models.users.update(
            { passwordHash: hashedPassword },
            { where: { id: userId } }
        );
    }
}
