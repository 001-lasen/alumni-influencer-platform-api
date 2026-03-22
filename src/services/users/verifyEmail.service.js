const logger = require('../../utils/logger');
const logVar = 'Services | verifyEmailService | ';
const encryptionUtil = require('../../utils/encryption');
const constants = require('../../utils/constants');
const otpEmailTemplate = require('../../utils/templates/otpEmail.template');
const transporter = require('../../utils/emailTransporter');
const {generateOTP, getOTPExpiry} = require("../../utils/otp");

module.exports = function buildVerifyEmailService(usersRepository) {
    return Object.freeze({
        resendOTP,
        sendOtpEmail,
        verifyEmail
    });

    async function resendOTP(email) {
        logger.info(logVar + 'In resendOTP service');

        const user = await usersRepository.findUserByEmail(email);
        if (!user) {
            logger.warn(logVar + 'User not found with email: ' + email);
            throw new Error('User not found');
        }

        if (user.isVerified) {
            logger.info(logVar + 'User email already verified for email: ' + email);
            throw new Error('Email is already verified');
        }

        logger.info(logVar + 'Generating OTP for email verification');
        const otp = generateOTP();
        const hashedOTP = await encryptionUtil.hash(otp);
        const otpExpiry = getOTPExpiry();

        logger.info(logVar + 'Sending OTP to user email: ' + email);
        await sendOtpEmail(email, otp);

        logger.info(logVar + 'Storing OTP hash and expiry in database for userId: ' + user.id);
        await usersRepository.saveOTP(user.id, hashedOTP, otpExpiry);

        logger.info(logVar + 'OTP resent successfully to email: ' + email);
        return {
            statusCode: 200,
            message: 'OTP resent successfully'
        }
    }

    async function sendOtpEmail(email, otp) {
        logger.info(logVar + 'In sendEmail service');

        const mailOptions = {
            from: `"Eastminster Alumni" <${constants.EMAIL_USER}>`,
            to: email,
            subject: 'OTP - Email Verification',
            html: otpEmailTemplate(otp)
        }

        try {
            await transporter.sendMail(mailOptions);
            logger.info(logVar + 'OTP email sent successfully to: ' + email);
        } catch (error) {
            logger.error(logVar + 'Error sending OTP email to ' + email + ': ' + error.message);
            throw new Error('Failed to send OTP email');
        }
    }

    async function verifyEmail(email, otp) {
        logger.info(logVar + 'In verifyEmail service');

        const user = await usersRepository.findUserByEmail(email);
        if (!user) {
            logger.warn(logVar + 'User not found with email: ' + email);
            throw new Error('User not found');
        }

        if (user.isVerified) {
            logger.info(logVar + 'User email already verified for email: ' + email);
            throw new Error('Email is already verified');
        }

        if (user.otpAttempts >= 5) {
            logger.warn(logVar + 'Maximum OTP attempts exceeded for email: ' + email);
            throw new Error('Maximum OTP attempts exceeded. Please request a new OTP.');
        }

        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            logger.warn(logVar + 'OTP has expired for email: ' + email);
            throw new Error('OTP has expired. Please request a new OTP.');
        }

        const isOTPValid = await encryptionUtil.compare(otp, user.otp);
        if (!isOTPValid) {
            logger.warn(logVar + 'Invalid OTP provided for email: ' + email);
            await usersRepository.incrementOTPAttempts(user.id);
            throw new Error('Invalid OTP');
        }

        await usersRepository.markEmailVerified(user.id);
        logger.info(logVar + 'Email verified successfully for email: ' + email);
        return {
            statusCode: 200,
            message: 'Email verified successfully'
        };
    }
}
