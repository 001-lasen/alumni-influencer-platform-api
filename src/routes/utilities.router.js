const express = require('express');
const router = express.Router();
const callback = require('../utils/callback');
const {hashData } = require('../controllers');

router.post('/hashing', callback(hashData));

module.exports = router;
