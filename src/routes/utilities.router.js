const express = require('express');
const router = express.Router();
const callback = require('../utils/callback');
const { hashPassword } = require('../controllers');

router.post('/hash-password', callback(hashPassword));

module.exports = router;
