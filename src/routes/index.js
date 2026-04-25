const express = require('express');
const router = express.Router();
const usersRouter = require('./users.router');
const utilitiesRouter = require('./utilities.router');
const profileRouter = require('./profile.router');
const biddingRouter = require('./bidding.router');
const analyticsRouter = require('./analytics.router');
const dashboardRouter = require('./dashboard.router');

router.use('/api/users', usersRouter);
router.use('/api/utilities', utilitiesRouter);
router.use('/api/profile', profileRouter);
router.use('/api/bidding', biddingRouter);
router.use('/api/analytics', analyticsRouter);
router.use('/dashboard', dashboardRouter);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
