const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    createUser,
    verifyEmail,
    resendOTP,
    login,
    logout,
    refresh,
    changePassword,
    forgotPassword,
    verifyForgotPasswordOTP,
    resetPassword
} = require('../controllers/authController');

/**
 * @swagger
 * /api/users/create-user:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/create-user', createUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/users/resend-otp:
 *   get:
 *     summary: Resend OTP to user email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: User's email address
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: Invalid email
 */
router.get('/resend-otp', resendOTP);

/**
 * @swagger
 * /api/users/verify-email:
 *   post:
 *     summary: Verify user email with OTP
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmail'
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid OTP or email
 */
router.post('/verify-email', verifyEmail);

/**
 * @swagger
 * /api/users/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshToken'
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authMiddleware(['ADMIN', 'ALUMNI', 'STUDENT', 'SPONSOR', 'DEVELOPER']), logout);

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/change-password', authMiddleware(['ADMIN', 'ALUMNI', 'STUDENT', 'SPONSOR', 'DEVELOPER']), changePassword);

/**
 * @swagger
 * /api/users/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPassword'
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Invalid email
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/users/verify-forgot-password-otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyForgotPasswordOTP'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 */
router.post('/verify-forgot-password-otp', verifyForgotPasswordOTP);

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid input
 */
router.post('/reset-password', resetPassword);

module.exports = router;
