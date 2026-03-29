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

router.post('/place', authMiddleware, callback(placeBid));
router.get('/status', authMiddleware, callback(getBidStatus));
router.get('/history', authMiddleware, callback(getBiddingHistory));
router.get('/monthly-limit', authMiddleware, callback(getMonthlyLimitStatus));
router.get('/tomorrow', authMiddleware, callback(getTomorrowSlot));

// public route
router.get('/alumni-of-the-day/:date', callback(getAlumniOfTheDay));

module.exports = router;
