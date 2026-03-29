const express = require('express');
const router = express.Router();
const callback = require('../utils/callback');
const {hashData} = require('../controllers');
const buildWinnerSelectionJob = require('../jobs/winnerSelection.job');
const repositories = require('../repositories');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/hashing', authMiddleware(['ADMIN', 'DEVELOPER']), callback(hashData));

router.post('/trigger-winner-selection', async (req, res) => {
    const winnerSelectionJob = buildWinnerSelectionJob(repositories.biddingRepository);
    await winnerSelectionJob.selectWinner();
    res.json({message: 'Winner selection triggered'});
});

module.exports = router;
