const logger = require('../../utils/logger');
const logVar = 'Services | verifyEmailService | ';
const bcrypt = require('bcrypt');

module.exports = function buildVerifyEmailService(usersRepository) {
    return Object.freeze({
        verifyEmail,
        resendOTP
    });

    async function verifyEmail(email, otp) {
        logger.info(logVar + 'In verifyEmail service');

        const user = await usersRepository.findByEmail(email);

        if (!user) {
            logger.warn(logVar + 'User not found: ' + email);
            throw new Error('User not found');
        }

        if (user.is_verified) {
            logger.warn(logVar + 'User already verified: ' + email);
            throw new Error('Email already verified');
        }

        if (user.otp_attempts >= 5) {
            logger.warn(logVar + 'Too many OTP attempts for: ' + email);
            throw new Error('Too many attempts. Please request a new OTP.');
        }

        if (!user.otp_expiry || new Date() > new Date(user.otp_expiry)) {
            logger.warn(logVar + 'OTP expired for: ' + email);
            throw new Error('OTP has expired. Please request a new one.');
        }

        const isMatch = await bcrypt.compare(otp, user.otp);
        if (!isMatch) {
            logger.warn(logVar + 'Invalid OTP for: ' + email);
            await usersRepository.incrementOTPAttempts(user.id);
            throw new Error('Invalid OTP');
        }

        await usersRepository.markEmailVerified(user.id);

        logger.info(logVar + 'Email verified successfully for: ' + email);
        return {
            statusCode: 200,
            message: 'Email verified successfully'
        };
    }

    async function resendOTP(email) {
        logger.info(logVar + 'In resendOTP service');

        const { generateOTP, getOTPExpiry } = require('../../utils/otp');
        const { sendOTPEmail } = require('../../services/emailService');
        const bcrypt = require('bcrypt');

        const user = await usersRepository.findByEmail(email);

        if (!user) throw new Error('User not found');
        if (user.is_verified) throw new Error('Email already verified');

        const otp = generateOTP();
        const hashedOTP = await bcrypt.hash(otp, 10);
        const otpExpiry = getOTPExpiry();

        await usersRepository.saveOTP(user.id, hashedOTP, otpExpiry);
        await sendOTPEmail(email, otp);

        logger.info(logVar + 'OTP resent to: ' + email);
        return {
            statusCode: 200,
            message: 'New OTP sent to your email'
        };
    }
}
