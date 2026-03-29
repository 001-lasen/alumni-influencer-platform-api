const transporter = require('./emailTransporter');
const constants = require('./constants');
const verifyEmailOTPTemplate = require('./templates/verifyEmailOTPEmail.template');
const forgotPasswordEmailTemplate = require('./templates/forgotPasswordEmail.template');
const winnerNotificationEmailTemplate = require('./templates/winnerNotificationEmail.template');
const logger = require('./logger');
const logVar = 'Utils | emailUtil | ';

async function sendOtpEmail(email, otp) {
    logger.info(logVar + 'Sending verification OTP to: ' + email);
    const mailOptions = {
        from: `"Eastminster Alumni" <${constants.EMAIL_USER}>`,
        to: email,
        subject: 'OTP - Email Verification',
        html: verifyEmailOTPTemplate(otp)
    };
    try {
        await transporter.sendMail(mailOptions);
        logger.info(logVar + 'Verification OTP sent successfully to: ' + email);
    } catch (error) {
        logger.error(logVar + 'Error sending OTP email: ' + error.message);
        throw new Error('Failed to send OTP email');
    }
}

async function sendForgotPasswordOtpEmail(email, otp) {
    logger.info(logVar + 'Sending password reset OTP to: ' + email);
    const mailOptions = {
        from: `"Eastminster Alumni" <${constants.EMAIL_USER}>`,
        to: email,
        subject: 'OTP - Password Reset',
        html: forgotPasswordEmailTemplate(otp)
    };
    try {
        await transporter.sendMail(mailOptions);
        logger.info(logVar + 'Password reset OTP sent successfully to: ' + email);
    } catch (error) {
        logger.error(logVar + 'Error sending password reset OTP email: ' + error.message);
        throw new Error('Failed to send password reset OTP email');
    }
}

async function sendWinnerNotificationEmail(email, firstName, slotDate) {
    logger.info(logVar + 'Sending winner notification to: ' + email);
    const mailOptions = {
        from: `"Eastminster Alumni" <${constants.EMAIL_USER}>`,
        to: email,
        subject: 'Congratulations! You are Alumni of the Day!',
        html: winnerNotificationEmailTemplate(firstName, slotDate)
    };
    try {
        await transporter.sendMail(mailOptions);
        logger.info(logVar + 'Winner notification sent to: ' + email);
    } catch (error) {
        logger.error(logVar + 'Error sending winner notification: ' + error.message);
        throw new Error('Failed to send winner notification email');
    }
}

module.exports = {sendOtpEmail, sendForgotPasswordOtpEmail, sendWinnerNotificationEmail};
