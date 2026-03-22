const express = require('express');
const router = express.Router();
const callback = require('../utils/callback');
const authMiddleware = require('../middleware/authMiddleware');
const {
    createPersonalInfo,
    updatePersonalInfo,
    getPersonalInfo
} = require('../controllers');

router.post('/personal', authMiddleware, callback(createPersonalInfo));
router.put('/personal', authMiddleware, callback(updatePersonalInfo));
router.get('/personal', authMiddleware, callback(getPersonalInfo));

module.exports = router;
