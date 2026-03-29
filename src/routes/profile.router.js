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

/**
 * @swagger
 * /profile/personal:
 *   post:
 *     summary: Create personal information
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PersonalInfo'
 *     responses:
 *       201:
 *         description: Personal information created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/personal', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(createPersonalInfo));

/**
 * @swagger
 * /profile/personal:
 *   put:
 *     summary: Update personal information
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PersonalInfo'
 *     responses:
 *       200:
 *         description: Personal information updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/personal', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(updatePersonalInfo));

/**
 * @swagger
 * /profile/user-details:
 *   get:
 *     summary: Get personal information
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personal information retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/user-details', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(getPersonalInfo));

/**
 * @swagger
 * /profile/qualifications:
 *   post:
 *     summary: Create qualifications
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Qualifications'
 *     responses:
 *       201:
 *         description: Qualifications created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/qualifications', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(createQualifications));

/**
 * @swagger
 * /profile/qualifications:
 *   put:
 *     summary: Update qualifications
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Qualifications'
 *     responses:
 *       200:
 *         description: Qualifications updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/qualifications', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(updateQualifications));

/**
 * @swagger
 * /profile/qualifications:
 *   get:
 *     summary: Get qualifications
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Qualifications retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/qualifications', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(getQualifications));

/**
 * @swagger
 * /profile/employment:
 *   post:
 *     summary: Create employment history
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employment'
 *     responses:
 *       201:
 *         description: Employment history created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/employment', authMiddleware, callback(createEmployment));

/**
 * @swagger
 * /profile/employment:
 *   put:
 *     summary: Update employment history
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employment'
 *     responses:
 *       200:
 *         description: Employment history updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/employment', authMiddleware, callback(updateEmployment));

/**
 * @swagger
 * /profile/employment:
 *   get:
 *     summary: Get employment history
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employment history retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/employment', authMiddleware, callback(getEmployment));

/**
 * @swagger
 * /profile/image:
 *   post:
 *     summary: Upload profile image
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profile image uploaded
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/image', authMiddleware, upload.single('image'), callback(uploadProfileImage));

/**
 * @swagger
 * /profile/image:
 *   get:
 *     summary: Get profile image
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile image retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/image', authMiddleware, callback(getProfileImage));

module.exports = router;
