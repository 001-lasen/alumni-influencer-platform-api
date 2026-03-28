const express = require('express');
const router = express.Router();
const callback = require('../utils/callback');
const authMiddleware = require('../middleware/authMiddleware');
const {
    createPersonalInfo,
    updatePersonalInfo,
    getPersonalInfo,
    createQualifications,
    updateQualifications,
    getQualifications
} = require('../controllers');

//personal info routes
router.post('/personal', authMiddleware, callback(createPersonalInfo));
router.put('/personal', authMiddleware, callback(updatePersonalInfo));
router.get('/personal', authMiddleware, callback(getPersonalInfo));

//qualifications routes
router.post('/qualifications', authMiddleware, callback(createQualifications));
router.put('/qualifications', authMiddleware, callback(updateQualifications));
router.get('/qualifications', authMiddleware, callback(getQualifications));

module.exports = router;
