const express = require('express');
const router = express.Router();
const callback = require('../utils/callback');
const { createUser, userLogin, resendOTP, verifyUserEmail} = require('../controllers');

router.post('/create-user', callback(createUser));
router.post('/login', callback(userLogin));
router.get('/resend-otp', callback(resendOTP));
router.post('/verify-email', callback(verifyUserEmail));

module.exports = router;
