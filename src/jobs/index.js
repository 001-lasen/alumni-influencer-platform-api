const cron = require('node-cron');
const logger = require('../utils/logger');
const logVar = 'Jobs | index | ';
const buildWinnerSelectionJob = require('./winnerSelection.job');
const models = require('../models');

module.exports = function startAllJobs() {
    const winnerSelectionJob = buildWinnerSelectionJob(models);

    cron.schedule('0 18 * * *', async () => {
        logger.info(logVar + 'Winner selection cron triggered at 18:00');
        await winnerSelectionJob.selectWinner();
    }, {
        timezone: 'Europe/London'
    });

    logger.info(logVar + 'All cron jobs scheduled:');
}
