const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { hashData, triggerWinnerSelection } = require('../controllers/utilitiesController');

/**
 * @swagger
 * tags:
 *   name: Utilities
 *   description: Utility endpoints for development and testing
 */

/**
 * @swagger
 * /api/utilities/hashing:
 *   post:
 *     summary: Hash a password or data string
 *     tags: [Utilities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: MyPassword123!
 *     responses:
 *       200:
 *         description: Password hashed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hashedPassword:
 *                   type: string
 *                   example: $2b$12$...
 *       400:
 *         description: Password is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       500:
 *         description: Internal server error
 */
router.post('/hashing', authMiddleware(['ADMIN', 'DEVELOPER']), hashData);

/**
 * @swagger
 * /api/utilities/trigger-winner-selection:
 *   post:
 *     summary: Manually trigger winner selection (testing only)
 *     description: >
 *       Simulates the 6 PM winner selection cron job.
 *       This endpoint is for testing purposes only and should be removed before production deployment.
 *     tags: [Utilities]
 *     responses:
 *       200:
 *         description: Winner selection triggered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Winner selection triggered successfully
 *       500:
 *         description: Internal server error
 */
router.post('/trigger-winner-selection', triggerWinnerSelection);

module.exports = router;
