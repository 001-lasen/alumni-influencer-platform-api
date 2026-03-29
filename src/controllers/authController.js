const logger = require('../utils/logger');
const logVar = ' Controller | authController | ';
const models = require('../models');
const encryptionUtil = require('../utils/encryption');
const jwtUtil = require('../utils/jwtUtil');
const {generateOTP, getOTPExpiry} = require('../utils/otp');
const {sendOtpEmail, sendForgotPasswordOtpEmail, sendWinnerNotificationEmail} = require('../utils/emailUtil');
const constants = require('../utils/constants');
const enums = require('../utils/enums');
const {Op} = require('sequelize');

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedDomains = constants.ALLOWED_EMAIL_DOMAIN;

    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }
    if (!allowedDomains.some(domain => email.endsWith('@' + domain))) {
        throw new Error('Email must be a valid university address');
    }
}

function validateUserType(userType) {
    if (!enums.UserTypes[userType]) {
        throw new Error('Invalid user type');
    }
}

async function findUserByEmail(email) {
    const cleanEmail = email.trim().toLowerCase();
    return await models.users.findOne({where: {email: cleanEmail}});
}

async function assignRoleToUser(userId, userType) {
    const role = await models.userRoles.findOne({where: {roleName: userType}});
    if (!role) throw new Error('Role not found for userType: ' + userType);
    await models.userRoleUserMapping.create({userId, roleId: role.id});
}

async function createUser(req, res) {
    logger.info(logVar + 'In createUser');

    const {email, password, userType} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: 'Email and password are required'});
    }

    try {
        validateEmail(email);
        validateUserType(userType);

        const cleanEmail = email.trim().toLowerCase();

        const existing = await models.users.findOne({where: {email: cleanEmail}});
        if (existing) {
            return res.status(400).json({message: 'User with this email already exists'});
        }

        const hashedPassword = await encryptionUtil.hash(password);

        const user = await models.users.create({
            email: cleanEmail,
            passwordHash: hashedPassword,
            userType,
        });

        await assignRoleToUser(user.id, userType);

        const otp = generateOTP();
        const hashedOTP = await encryptionUtil.hash(otp);
        const otpExpiry = getOTPExpiry();

        await models.users.update(
            {otp: hashedOTP, otpExpiry, otpAttempts: 0},
            {where: {id: user.id}}
        );

        await sendOtpEmail(email, otp);

        logger.info(logVar + 'User created successfully for email: ' + email);
        return res.status(201).json({message: 'User created successfully'});

    } catch (error) {
        logger.error(logVar + 'Error creating user: ' + error.message);
        return res.status(500).json({message: error.message});
    }
}

async function verifyEmail(req, res) {
    logger.info(logVar + 'In verifyEmail');

    const {email, otp} = req.body;

    if (!email || !otp) {
        return res.status(400).json({message: 'Email and OTP are required'});
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }

        if (user.isVerified) {
            return res.status(400).json({message: 'Email is already verified'});
        }

        if (user.otpAttempts >= 5) {
            return res.status(400).json({message: 'Maximum OTP attempts exceeded. Please request a new OTP.'});
        }

        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            return res.status(400).json({message: 'OTP has expired. Please request a new OTP.'});
        }

        const isOTPValid = await encryptionUtil.compare(otp, user.otp);
        if (!isOTPValid) {
            await models.users.increment('otpAttempts', {where: {id: user.id}});
            return res.status(400).json({message: 'Invalid OTP'});
        }

        await models.users.update(
            {isVerified: true, otp: null, otpExpiry: null, otpAttempts: 0},
            {where: {id: user.id}}
        );

        logger.info(logVar + 'Email verified successfully for: ' + email);
        return res.status(200).json({message: 'Email verified successfully'});

    } catch (error) {
        logger.error(logVar + 'Error verifying email: ' + error.message);
        return res.status(500).json({message: error.message});
    }
}

async function resendOTP(req, res) {
    logger.info(logVar + 'In resendOTP');

    const {email} = req.body;

    if (!email) {
        return res.status(400).json({message: 'Email is required'});
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }

        if (user.isVerified) {
            return res.status(400).json({message: 'Email is already verified'});
        }

        const otp = generateOTP();
        const hashedOTP = await encryptionUtil.hash(otp);
        const otpExpiry = getOTPExpiry();

        await models.users.update(
            {otp: hashedOTP, otpExpiry, otpAttempts: 0},
            {where: {id: user.id}}
        );

        await sendOtpEmail(email, otp);

        logger.info(logVar + 'OTP resent successfully to: ' + email);
        return res.status(200).json({message: 'OTP resent successfully'});

    } catch (error) {
        logger.error(logVar + 'Error resending OTP: ' + error.message);
        return res.status(500).json({message: error.message});
    }
}

async function login(req, res) {
    logger.info(logVar + 'In login');

    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: 'Email and password are required'});
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const isPasswordValid = await encryptionUtil.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        if (!user.isVerified) {
            return res.status(401).json({message: 'Please verify your email before logging in'});
        }

        const userWithRoles = await models.users.findOne({
            where: {id: user.id},
            include: [{
                model: models.userRoles,
                as: 'roles',
                attributes: ['roleName'],
                through: {attributes: []}
            }]
        });

        const roleNames = userWithRoles.roles.map(r => r.roleName);
        const payload = {userId: user.id, email: user.email, roles: roleNames};

        const accessToken = jwtUtil.generateAccessToken(payload);
        const refreshToken = jwtUtil.generateRefreshToken({userId: user.id});

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await models.refreshTokens.create({
            userId: user.id,
            token: refreshToken,
            expiresAt,
            isRevoked: false,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        logger.info(logVar + 'Login successful for: ' + email);
        return res.status(200).json({status: 'success', accessToken});

    } catch (error) {
        logger.error(logVar + 'Error logging in: ' + error.message);
        return res.status(500).json({message: error.message});
    }
}

async function logout(req, res) {
    logger.info(logVar + 'In logout');

    const refreshToken = req.cookies?.refreshToken;
    const authHeader = req.headers?.authorization;
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    try {
        if (refreshToken) {
            await models.refreshTokens.update(
                {isRevoked: true},
                {where: {token: refreshToken}}
            );
            logger.info(logVar + 'Refresh token revoked');
        }

        if (accessToken) {
            const decoded = jwtUtil.decodeToken(accessToken);
            if (decoded?.exp) {
                const expiresAt = new Date(decoded.exp * 1000);
                await models.tokenBlacklist.create({token: accessToken, expiresAt});
                logger.info(logVar + 'Access token blacklisted');
            }
        }

        res.clearCookie('refreshToken');
        logger.info(logVar + 'User logged out successfully');
        return res.status(200).json({message: 'Logged out successfully'});

    } catch (error) {
        logger.error(logVar + 'Error logging out: ' + error.message);
        return res.status(500).json({message: error.message});
    }
}

async function refresh(req, res) {
    logger.info(logVar + 'In refresh');

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({message: 'No refresh token provided'});
    }

    try {
        let decoded;
        try {
            decoded = jwtUtil.verifyRefreshToken(refreshToken);
        } catch (error) {
            return res.status(401).json({message: 'Invalid or expired refresh token'});
        }

        const storedToken = await models.refreshTokens.findOne({
            where: {token: refreshToken, isRevoked: false}
        });

        if (!storedToken) {
            return res.status(401).json({message: 'Invalid or expired refresh token'});
        }

        if (storedToken.expiresAt < new Date()) {
            return res.status(401).json({message: 'Refresh token has expired, please log in again'});
        }

        const userWithRoles = await models.users.findOne({
            where: {id: decoded.userId},
            include: [{
                model: models.userRoles,
                as: 'roles',
                attributes: ['roleName'],
                through: {attributes: []}
            }]
        });

        const roleNames = userWithRoles.roles.map(r => r.roleName);
        const payload = {userId: decoded.userId, roles: roleNames};
        const accessToken = jwtUtil.generateAccessToken(payload);

        logger.info(logVar + 'Access token refreshed for userId: ' + decoded.userId);
        return res.status(200).json({accessToken});

    } catch (error) {
        logger.error(logVar + 'Error refreshing token: ' + error.message);
        return res.status(500).json({message: error.message});
    }
}

async function changePassword(req, res) {
    logger.info(logVar + 'In changePassword');

    const {currentPassword, newPassword} = req.body;
    const userId = req.user?.userId;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({message: 'Current password and new password are required'});
    }

    try {
        const user = await models.users.findOne({where: {id: userId}});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const isPasswordValid = await encryptionUtil.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({message: 'Current password is incorrect'});
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({message: 'New password must be different from current password'});
        }

        const hashedPassword = await encryptionUtil.hash(newPassword);
        await models.users.update(
            {passwordHash: hashedPassword},
            {where: {id: userId}}
        );

        await models.refreshTokens.update(
            {isRevoked: true},
            {where: {userId, isRevoked: false}}
        );

        logger.info(logVar + 'Password changed successfully for userId: ' + userId);
        return res.status(200).json({message: 'Password changed successfully'});

    } catch (error) {
        logger.error(logVar + 'Error changing password: ' + error.message);
        return res.status(500).json({message: error.message});
    }
}

async function forgotPassword(req, res) {
    logger.info(logVar + 'In forgotPassword');

    const {email} = req.body;

    if (!email) {
        return res.status(400).json({message: 'Email is required'});
    }

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(200).json({message: 'If this email exists, an OTP has been sent'});
        }

        if (!user.isVerified) {
            return res.status(400).json({message: 'Please verify your email before resetting your password'});
        }

        const otp = generateOTP();
        const hashedOTP = await encryptionUtil.hash(otp);
        const otpExpiry = getOTPExpiry();

        await models.users.update(
            {otp: hashedOTP, otpExpiry, otpAttempts: 0},
            {where: {id: user.id}}
        );

        await sendForgotPasswordOtpEmail(email, otp);

        logger.info(logVar + 'Password reset OTP sent to: ' + email);
        return res.status(200).json({message: 'If this email exists, an OTP has been sent'});

    } catch (error) {
        logger.error(logVar + 'Error in forgotPassword: ' + error.message);
        return res.status(500).json({message: error.message});
    }
}

async function verifyForgotPasswordOTP(req, res) {
    logger.info(logVar + 'In verifyForgotPasswordOTP');

    const {email, otp} = req.body;

    if (!email || !otp) {
        return res.status(400).json({message: 'Email and OTP are required'});
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({message: 'Invalid OTP'});
        }

        if (user.otpAttempts >= 5) {
            return res.status(400).json({message: 'Maximum OTP attempts exceeded. Please request a new OTP.'});
        }

        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            return res.status(400).json({message: 'OTP has expired. Please request a new one.'});
        }

        const isOTPValid = await encryptionUtil.compare(otp, user.otp);
        if (!isOTPValid) {
            await models.users.increment('otpAttempts', {where: {id: user.id}});
            return res.status(400).json({message: 'Invalid OTP'});
        }

        await models.users.update(
            {otpVerified: true},
            {where: {id: user.id}}
        );

        logger.info(logVar + 'OTP verified for userId: ' + user.id);
        return res.status(200).json({message: 'OTP verified successfully'});

    } catch (error) {
        logger.error(logVar + 'Error verifying OTP: ' + error.message);
        return res.status(500).json({message: error.message});
    }
}

async function resetPassword(req, res) {
    logger.info(logVar + 'In resetPassword');

    const {email, newPassword} = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({message: 'Email and new password are required'});
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }

        if (!user.otpVerified) {
            return res.status(400).json({message: 'Please verify your OTP before resetting your password'});
        }

        const hashedPassword = await encryptionUtil.hash(newPassword);

        await models.users.update(
            {passwordHash: hashedPassword},
            {where: {id: user.id}}
        );

        await models.users.update(
            {otpVerified: false, otp: null, otpExpiry: null, otpAttempts: 0},
            {where: {id: user.id}}
        );

        await models.refreshTokens.update(
            {isRevoked: true},
            {where: {userId: user.id, isRevoked: false}}
        );

        logger.info(logVar + 'Password reset successfully for userId: ' + user.id);
        return res.status(200).json({message: 'Password reset successfully. Please log in again.'});

    } catch (error) {
        logger.error(logVar + 'Error resetting password: ' + error.message);
        return res.status(500).json({message: error.message});
    }
}

module.exports = {
    createUser,
    verifyEmail,
    resendOTP,
    login,
    logout,
    refresh,
    changePassword,
    forgotPassword,
    verifyForgotPasswordOTP,
    resetPassword,
};
