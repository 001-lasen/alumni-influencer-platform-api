const express = require('express');
const router = express.Router();
const callback = require('../utils/callback');
const { createUser } = require('../controllers');

router.post('/create-user', callback(createUser));

module.exports = router;
