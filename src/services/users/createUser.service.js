const logger = require('../../utils/logger');
const logVar = 'Services | createUserService | ';
const enums = require('../../utils/enums');
const {generateOTP, getOTPExpiry} = require("../../utils/otp");
const encryptionUtil = require('../../utils/encryption');
const {sendOtpEmail} = require('../../utils/emailUtil');
const constants = require('../../utils/constants');

module.exports = function buildCreateUserService(usersRepository, userRolesRepository) {
    return Object.freeze({
        createUser,
        validateEmail,
        validateUserType
    });

    async function createUser(email, password, userType) {
        logger.info(logVar + 'In createUser service');

        logger.info(logVar + 'Validating email');
        validateEmail(email);

        validateUserType(userType);

        try {
            logger.info(logVar + 'Creating user');
            const result = await usersRepository.createUser(email, password, userType);

            logger.info(logVar + 'Assigning default role to user');
            await userRolesRepository.assignRoleToUser(result.id, userType);
            logger.info(logVar + 'User creation successful in service');

            logger.info(logVar + 'Generating OTP for email verification');
            const otp = generateOTP();
            const hashedOTP = await encryptionUtil.hash(otp);
            const otpExpiry = getOTPExpiry();

            logger.info(logVar + 'Sending OTP to user email: ' + email);
            await sendOtpEmail(email, otp);

            logger.info(logVar + 'Storing OTP hash and expiry in database for userId: ' + result.id);
            await usersRepository.saveOTP(result.id, hashedOTP, otpExpiry);

            logger.info(logVar + 'User created successfully');
            return {
                statusCode: 201,
                message: 'User created successfully'
            }
        } catch (error) {
            logger.error(logVar + 'Error in createUser service: ' + error.message);
            throw new Error(error.message);
        }
    }

    function validateEmail(email) {
        logger.info(logVar + 'Validating email format');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const allowedDomains = constants.ALLOWED_EMAIL_DOMAIN;

        if (!emailRegex.test(email)) {
            logger.warn(logVar + 'Invalid email format: ' + email);
            throw new Error('Invalid email format');
        }

        if (!allowedDomains.some(domain => email.endsWith('@' + domain))) {
            throw new Error('Email must be a valid university address');
        }

        logger.info(logVar + 'Email format is valid');
    }

    function validateUserType(userType) {
        logger.info(logVar + 'Validating user type');

        if (!enums.UserTypes[userType]) {
            logger.error(logVar + 'Invalid user type: ' + userType);
            throw new Error('Invalid user type');
        }
        logger.info(logVar + 'User type is valid');
    }
}
