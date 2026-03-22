const encryptionUtil = require('../../utils/encryption');
const jwtUtil = require('../../utils/jwtUtil');
const logger = require('../../utils/logger');
const logVar = 'Services | userLoginService | ';

module.exports = function buildUserLoginService(usersRepository, userRolesRepository, refreshTokenRepository) {
    return Object.freeze({
        loginUser,
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
        const isPasswordValid = await encryptionUtil.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            logger.warn(logVar + 'Invalid password for user');
            throw new Error('Invalid email or password');
        }
        logger.info(logVar + 'User validated successfully.');

        if (!user.isVerified) {
            logger.info(logVar + 'User email not verified');
            throw new Error('Please verify your email before logging in');
        }

        logger.info(logVar + 'Generating tokens for user');
        const userRoles = await userRolesRepository.getUserRoleIds(user.id);

        const payload = { userId: user.id, email: user.email, roles: userRoles };

        const accessToken = jwtUtil.generateAccessToken(payload);
        const refreshToken = jwtUtil.generateRefreshToken({ userId: user.id });

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await refreshTokenRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

        logger.info(logVar + 'Login successful, returning tokens');
        return {
            statusCode: 200,
            status: 'success',
            accessToken,
            refreshToken,
        };
    }
}
