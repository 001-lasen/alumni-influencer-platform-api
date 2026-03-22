const express = require('express');
const router = express.Router();
const callback = require('../utils/callback');
const authMiddleware = require('../middleware/authMiddleware');
const {
    createUser,
    userLogin,
    resendOTP,
    verifyUserEmail,
    refreshToken,
    userLogout,
    changePassword,
    forgotPassword,
    verifyForgotPasswordOTP,
    resetPassword
} = require('../controllers');

router.post('/create-user', callback(createUser));
router.post('/login', callback(userLogin));
router.get('/resend-otp', callback(resendOTP));
router.post('/verify-email', callback(verifyUserEmail));
router.post('/refresh', callback(refreshToken));
router.post('/logout', authMiddleware, callback(userLogout));
router.post('/change-password', authMiddleware, callback(changePassword));
router.post('/forgot-password', callback(forgotPassword));
router.post('/verify-forgot-password-otp', callback(verifyForgotPasswordOTP));
router.post('/reset-password', callback(resetPassword));

module.exports = router;
