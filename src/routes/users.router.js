const express = require('express');
const router = express.Router();
const callback = require('../utils/callback');
const { createUser, userLogin } = require('../controllers');

router.post('/create-user', callback(createUser));
router.post('/login', callback(userLogin));

module.exports = router;
