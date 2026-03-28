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
    getQualifications,
    createEmployment,
    updateEmployment,
    getEmployment,
    uploadProfileImage,
    getProfileImage
} = require('../controllers');
const {upload} = require('../config/cloudinary');

//personal info routes
router.post('/personal', authMiddleware, callback(createPersonalInfo));
router.put('/personal', authMiddleware, callback(updatePersonalInfo));
router.get('/personal', authMiddleware, callback(getPersonalInfo));

//qualifications routes
router.post('/qualifications', authMiddleware, callback(createQualifications));
router.put('/qualifications', authMiddleware, callback(updateQualifications));
router.get('/qualifications', authMiddleware, callback(getQualifications));

//employment history routes
router.post('/employment', authMiddleware, callback(createEmployment));
router.put('/employment', authMiddleware, callback(updateEmployment));
router.get('/employment', authMiddleware, callback(getEmployment));
router.post('/image', authMiddleware, upload.single('image'), callback(uploadProfileImage));
router.get('/image', authMiddleware, callback(getProfileImage));

module.exports = router;
