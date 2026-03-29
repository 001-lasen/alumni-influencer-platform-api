const express = require('express');
const router = express.Router();
const callback = require('../utils/callback');
const authMiddleware = require('../middleware/authMiddleware');
const {
    placeBid,
    getBidStatus,
    getBiddingHistory,
    getMonthlyLimitStatus,
    getTomorrowSlot,
    getAlumniOfTheDay,
} = require('../controllers');

/**
 * @swagger
 * tags:
 *   name: Bidding
 *   description: Blind bidding system
 */

/**
 * @swagger
 * /api/bidding/place:
 *   post:
 *     summary: Place or update a bid for tomorrow's slot
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bidAmount
 *             properties:
 *               bidAmount:
 *                 type: number
 *                 example: 250
 *     responses:
 *       201:
 *         description: Bid placed successfully
 *       200:
 *         description: Bid updated successfully
 *       400:
 *         description: Validation error or bidding closed
 */
router.post('/place', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(placeBid));

/**
 * @swagger
 * /api/bidding/status:
 *   get:
 *     summary: Get current bid status (winning or losing)
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bid status retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/status', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(getBidStatus));

/**
 * @swagger
 * /api/bidding/history:
 *   get:
 *     summary: Get own bid history
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bid history retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/history', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(getBiddingHistory));

/**
 * @swagger
 * /api/bidding/monthly-limit:
 *   get:
 *     summary: Get monthly win limit status
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly limit status retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/monthly-limit', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(getMonthlyLimitStatus));

/**
 * @swagger
 * /api/bidding/tomorrow:
 *   get:
 *     summary: View tomorrow's slot info
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tomorrow's slot info retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/tomorrow', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(getTomorrowSlot));

/**
 * @swagger
 * /api/bidding/alumni-of-the-day/{date}:
 *   get:
 *     summary: Get alumni of the day for a specific date (public)
 *     tags: [Bidding]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026-03-30"
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Alumni of the day retrieved
 */
router.get('/alumni-of-the-day/:date', callback(getAlumniOfTheDay));

module.exports = router;
