const encryptionUtil = require('../../utils/encryption');
const logger = require('../../utils/logger');
const logVar = 'Services | changePasswordService | ';

module.exports = function buildChangePasswordService(usersRepository, refreshTokenRepository) {
    return Object.freeze({
        changePassword
    });

    async function changePassword(userId, currentPassword, newPassword) {
        logger.info(logVar + 'In changePassword service');

        const user = await usersRepository.findUserById(userId);
        if (!user) {
            logger.error(logVar + 'User not found for userId: ' + userId);
            throw new Error('User not found');
        }

        const isPasswordValid = await encryptionUtil.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            logger.error(logVar + 'Invalid current password for userId: ' + userId);
            throw new Error('Current password is incorrect');
        }

        if (currentPassword === newPassword) {
            logger.error(logVar + 'New password must be different from current password for userId: ' + userId);
            throw new Error('New password must be different from current password');
        }

        const hashedPassword = await encryptionUtil.hash(newPassword);
        await usersRepository.updatePassword(userId, hashedPassword);

        await refreshTokenRepository.revokeAllUserTokens(userId);

        logger.info(logVar + 'Password changed successfully for userId: ' + userId);
        return {statusCode: 200, message: 'Password changed successfully'};
    }
}
