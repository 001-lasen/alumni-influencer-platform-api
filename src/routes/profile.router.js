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
} = require('../controllers/profileController');
const {upload} = require('../config/cloudinary');

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Alumni profile management
 */

/**
 * @swagger
 * /api/profile/personal:
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
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - userName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Lasen
 *               lastName:
 *                 type: string
 *                 example: Vindula
 *               userName:
 *                 type: string
 *                 example: lasen.vindula
 *               email:
 *                 type: string
 *                 example: lasen@iit.ac.lk
 *               contactNumber:
 *                 type: string
 *                 example: "+94771234567"
 *               linkedInProfile:
 *                 type: string
 *                 example: https://linkedin.com/in/lasen-vindula
 *               biography:
 *                 type: string
 *                 example: Passionate software engineer
 *     responses:
 *       201:
 *         description: Personal info created successfully
 *       400:
 *         description: Validation error or already exists
 *       401:
 *         description: Unauthorized
 */
router.post('/personal', authMiddleware(['ALUMNI', 'DEVELOPER']), createPersonalInfo);

/**
 * @swagger
 * /api/profile/personal:
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
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               linkedInProfile:
 *                 type: string
 *               biography:
 *                 type: string
 *     responses:
 *       200:
 *         description: Personal info updated successfully
 *       404:
 *         description: Personal info not found
 *       401:
 *         description: Unauthorized
 */
router.put('/personal', authMiddleware(['ALUMNI', 'DEVELOPER']), updatePersonalInfo);

/**
 * @swagger
 * /api/profile/personal:
 *   get:
 *     summary: Get personal information
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personal info retrieved successfully
 *       404:
 *         description: Personal info not found
 *       401:
 *         description: Unauthorized
 */
router.get('/user-details', authMiddleware(['ALUMNI', 'DEVELOPER', 'ADMIN']), getPersonalInfo);

/**
 * @swagger
 * /api/profile/qualifications:
 *   post:
 *     summary: Add qualifications
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               degrees:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     degreeName:
 *                       type: string
 *                       example: BSc Computer Science
 *                     institution:
 *                       type: string
 *                       example: University of Westminster
 *                     degreeUrl:
 *                       type: string
 *                       example: https://westminster.ac.uk/cs
 *                     completionDate:
 *                       type: string
 *                       example: "2023-06-01"
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     certificationName:
 *                       type: string
 *                     issuingBody:
 *                       type: string
 *                     certificationUrl:
 *                       type: string
 *                     completionDate:
 *                       type: string
 *               licences:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     licenceName:
 *                       type: string
 *                     awardingBody:
 *                       type: string
 *                     licenceUrl:
 *                       type: string
 *                     completionDate:
 *                       type: string
 *               courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     courseName:
 *                       type: string
 *                     provider:
 *                       type: string
 *                     courseUrl:
 *                       type: string
 *                     completionDate:
 *                       type: string
 *     responses:
 *       201:
 *         description: Qualifications added successfully
 *       400:
 *         description: Validation error or already exists
 *       401:
 *         description: Unauthorized
 */
router.post('/qualifications', authMiddleware(['ALUMNI', 'DEVELOPER']), createQualifications);

/**
 * @swagger
 * /api/profile/qualifications:
 *   put:
 *     summary: Update all qualifications
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               degrees:
 *                 type: array
 *                 items:
 *                   type: object
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: object
 *               licences:
 *                 type: array
 *                 items:
 *                   type: object
 *               courses:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Qualifications updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/qualifications', authMiddleware(['ALUMNI', 'DEVELOPER']), updateQualifications);

/**
 * @swagger
 * /api/profile/qualifications:
 *   get:
 *     summary: Get all qualifications
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Qualifications retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/qualifications', authMiddleware(['ALUMNI', 'DEVELOPER']), getQualifications);

/**
 * @swagger
 * /api/profile/employment:
 *   post:
 *     summary: Add employment history
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employment:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     companyName:
 *                       type: string
 *                       example: Axiata Digital Labs
 *                     jobTitle:
 *                       type: string
 *                       example: Software Engineering Intern
 *                     startDate:
 *                       type: string
 *                       example: "2024-01-01"
 *                     endDate:
 *                       type: string
 *                       example: "2024-09-30"
 *                     isCurrent:
 *                       type: boolean
 *                       example: false
 *     responses:
 *       201:
 *         description: Employment history created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/employment', authMiddleware(['ALUMNI', 'DEVELOPER']), createEmployment);

/**
 * @swagger
 * /api/profile/employment:
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
 *             type: object
 *             properties:
 *               employment:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     uuid:
 *                       type: string
 *                       description: Include uuid to update existing entry
 *                     companyName:
 *                       type: string
 *                     jobTitle:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                     endDate:
 *                       type: string
 *                     isCurrent:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Employment history updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put('/employment', authMiddleware(['ALUMNI', 'DEVELOPER']), updateEmployment);

/**
 * @swagger
 * /api/profile/employment:
 *   get:
 *     summary: Get employment history
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employment history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/employment', authMiddleware(['ALUMNI', 'DEVELOPER']), getEmployment);

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
router.post('/image', authMiddleware, upload.single('image'), uploadProfileImage);

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
router.get('/image', authMiddleware, getProfileImage);

module.exports = router;
