const logger = require('../utils/logger');
const logVar = 'Controller | utilitiesController | ';
const encryptionUtil = require('../utils/encryption');
const buildWinnerSelectionJob = require('../jobs/winnerSelection.job');
const repositories = require('../repositories');

async function hashData(req, res) {
    logger.info(logVar + 'In hashData');

    const {password} = req.body;

    if (!password) {
        logger.warn(logVar + 'Missing password in request body');
        return res.status(400).json({message: 'Password is required'});
    }

    try {
        const hashedPassword = await encryptionUtil.hash(password);
        logger.info(logVar + 'Password hashed successfully');
        return res.status(200).json({hashedPassword});
    } catch (error) {
        logger.error(logVar + 'Error hashing password: ' + error.message);
        return res.status(500).json({message: error.message});
    }
}

async function triggerWinnerSelection(req, res) {
    logger.info(logVar + 'In triggerWinnerSelection');

    try {
        const winnerSelectionJob = buildWinnerSelectionJob(repositories.biddingRepository);
        await winnerSelectionJob.selectWinner();
        logger.info(logVar + 'Winner selection triggered successfully');
        return res.status(200).json({message: 'Winner selection triggered successfully'});
    } catch (error) {
        logger.error(logVar + 'Error triggering winner selection: ' + error.message);
        return res.status(500).json({message: error.message});
    }
}

module.exports = {hashData, triggerWinnerSelection};
