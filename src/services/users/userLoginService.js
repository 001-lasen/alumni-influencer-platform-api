const encryptionUtil = require('../../utils/encryption');
const jwtUtil = require('../../utils/jwtUtil');
const logger = require('../../utils/logger');
const logVar = 'Services | userLoginService | ';

module.exports = function buildUserLoginService(usersRepository) {
    return Object.freeze({
        loginUser,
        checkPassword
    });

    async function loginUser(email, password) {
        logger.info(logVar + 'In loginUser service');

        logger.info(logVar + 'Retrieving user by email');
        const user = await usersRepository.findUserByEmail(email);
        if (!user) {
            logger.warn(logVar + 'User not found with email');
            throw new Error('Invalid email or password');
        }

        logger.info(logVar + 'Validating user password');
        const isPasswordValid = await checkPassword(password, user.passwordHash);
        if (!isPasswordValid) {
            logger.warn(logVar + 'Invalid password for user');
            throw new Error('Invalid email or password');
        }
        logger.info(logVar + 'User validated successfully.');

        if (!user.isVerified) {
            logger.info(logVar + 'User email not verified for email');
            throw new Error('Please verify your email before logging in');
        }

        logger.info(logVar + 'Generating access token for user');
        const accessToken = jwtUtil.generateAccessToken({ userId: user.id, email: user.email });

        logger.info(logVar + 'Login successful, returning access token');
        return { accessToken };
    }

    async function checkPassword(password, hashedPassword) {
        logger.info(logVar + 'Checking password');
        return await encryptionUtil.comparePassword(password, hashedPassword);
    }
}
