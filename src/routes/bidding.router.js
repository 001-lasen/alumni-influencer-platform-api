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
} = require('../controllers')

router.post('/place', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(placeBid));
router.get('/status', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(getBidStatus));
router.get('/history', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(getBiddingHistory));
router.get('/monthly-limit', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(getMonthlyLimitStatus));
router.get('/tomorrow', authMiddleware(['ALUMNI', 'DEVELOPER']), callback(getTomorrowSlot));

// public route
router.get('/alumni-of-the-day/:date', callback(getAlumniOfTheDay));

module.exports = router;
