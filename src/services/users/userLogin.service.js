const encryptionUtil = require('../../utils/encryption');
const jwtUtil = require('../../utils/jwtUtil');
const logger = require('../../utils/logger');
const logVar = 'Services | userLoginService | ';

module.exports = function buildUserLoginService(usersRepository, userRolesRepository) {
    return Object.freeze({
        loginUser,
        checkPassword,
        generateAccessToken
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
        console.log("Password valid: " + isPasswordValid);
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
        const accessToken = await generateAccessToken(user.id, user.email);

        logger.info(logVar + 'Login successful, returning access token');
        return {
            statusCode: 200,
            status: "success",
            token: accessToken
        };
    }

    async function checkPassword(password, hashedPassword) {
        logger.info(logVar + 'Checking password');
        return await encryptionUtil.compare(password, hashedPassword);
    }

    async function generateAccessToken(userId, email) {
        logger.info(logVar + 'Retrieving user role for userId: ' + userId);

        const userRoles = await userRolesRepository.getUserRoleIds(userId);

        const payload = {
            userId: userId,
            email: email,
            roles: userRoles
        }

        return jwtUtil.generateToken(payload);
    }
}
