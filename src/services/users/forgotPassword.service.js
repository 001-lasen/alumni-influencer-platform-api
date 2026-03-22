const encryptionUtil = require('../../utils/encryption');
const logger = require('../../utils/logger');
const logVar = 'Services | forgotPasswordService | ';
const {generateOTP, getOTPExpiry} = require("../../utils/otp");
const {sendForgotPasswordOtpEmail} = require('../../utils/emailUtil');

module.exports = function buildForgotPasswordService(usersRepository, refreshTokenRepository) {
    return Object.freeze({
        forgotPassword,
        verifyForgotPasswordOTP,
        resetPassword
    });

    async function forgotPassword(email) {
        logger.info(logVar + 'In forgotPassword service');

        const user = await usersRepository.findUserByEmail(email);

        if (!user) {
            logger.warn(logVar + 'User not found, returning generic response');
            return {statusCode: 200, message: 'If this email exists, an OTP has been sent'};
        }

        if (!user.isVerified) {
            throw new Error('Please verify your email before resetting your password');
        }

        const otp = generateOTP();
        const hashedOTP = await encryptionUtil.hash(otp);
        const otpExpiry = getOTPExpiry();

        await usersRepository.saveOTP(user.id, hashedOTP, otpExpiry);
        await sendForgotPasswordOtpEmail(email, otp);

        logger.info(logVar + 'Password reset OTP sent to: ' + email);
        return {statusCode: 200, message: 'If this email exists, an OTP has been sent'};
    }

    async function verifyForgotPasswordOTP(email, otp) {
        logger.info(logVar + 'In verifyForgotPasswordOTP service');

        const user = await usersRepository.findUserByEmail(email);
        if (!user) {
            throw new Error('Invalid OTP');
        }

        if (user.otpAttempts >= 5) {
            throw new Error('Maximum OTP attempts exceeded. Please request a new OTP.');
        }

        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            throw new Error('OTP has expired. Please request a new one.');
        }

        const isOTPValid = await encryptionUtil.compare(otp, user.otp);
        if (!isOTPValid) {
            await usersRepository.incrementOTPAttempts(user.id);
            throw new Error('Invalid OTP');
        }

        await usersRepository.markOTPVerified(user.id);

        logger.info(logVar + 'OTP verified for userId: ' + user.id);
        return {statusCode: 200, message: 'OTP verified successfully'};
    }

    async function resetPassword(email, newPassword) {
        logger.info(logVar + 'In resetPassword service');

        const user = await usersRepository.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        if (!user.otpVerified) {
            logger.warn(logVar + 'OTP not verified for userId: ' + user.id);
            throw new Error('Please verify your OTP before resetting your password');
        }

        const hashedPassword = await encryptionUtil.hash(newPassword);
        await usersRepository.updatePassword(user.id, hashedPassword);

        await usersRepository.clearOTPVerified(user.id);
        await refreshTokenRepository.revokeAllUserTokens(user.id);

        logger.info(logVar + 'Password reset successfully for userId: ' + user.id);
        return {statusCode: 200, message: 'Password reset successfully. Please log in again.'};
    }
}
