const logger = require('../utils/logger');
const logVar = 'Controller | biddingController | ';
const models = require('../models');
const {Op} = require('sequelize');

function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

function isBiddingOpen() {
    const now = new Date();
    return now.getHours() < 18;
}

async function getMonthlyWinCount(userId) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return await models.bids.count({
        where: {
            userId,
            isWinner: true,
            slotDate: {[Op.between]: [startOfMonth, endOfMonth]}
        }
    });
}

async function getUserEventCountThisMonth(userId) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return await models.alumniEvents.count({
        where: {
            userId,
            eventDate: {[Op.between]: [startOfMonth, endOfMonth]}
        }
    });
}

async function getAlumniOfTheDayRecord(slotDate) {
    return await models.alumniOfTheDay.findOne({
        where: {slotDate, isActive: true},
        include: [
            {
                model: models.users,
                as: 'User',
                include: [
                    {
                        model: models.userDetails,
                        as: 'details',
                        include: [
                            {
                                model: models.profileImages,
                                as: 'profileImages',
                                where: {isDeleted: false},
                                required: false
                            },
                            {model: models.degrees, as: 'degrees', required: false},
                            {model: models.certifications, as: 'certifications', required: false},
                            {model: models.licences, as: 'licences', required: false},
                            {model: models.professionalCourses, as: 'professionalCourses', required: false},
                            {model: models.employmentHistory, as: 'employmentHistory', required: false},
                        ]
                    }
                ]
            }
        ]
    });
}

async function placeBid(req, res) {
    logger.info(logVar + 'In placeBid');

    const userId = req.user?.userId;
    const {bidAmount} = req.body;

    if (!bidAmount) {
        return res.status(400).json({message: 'Bid amount is required'});
    }

    if (bidAmount <= 0) {
        return res.status(400).json({message: 'Bid amount must be greater than 0'});
    }

    if (!isBiddingOpen()) {
        return res.status(400).json({message: 'Bidding is closed. Winner has already been selected for today.'});
    }

    try {
        const winCount = await getMonthlyWinCount(userId);
        const eventCount = await getUserEventCountThisMonth(userId);
        const maxWins = eventCount > 0 ? 4 : 3;

        if (winCount >= maxWins) {
            return res.status(400).json({message: `You have reached your monthly limit of ${maxWins} wins this month`});
        }

        const slotDate = getTomorrowDate();

        const winnerAlreadySelected = await getAlumniOfTheDayRecord(slotDate);
        if (winnerAlreadySelected) {
            return res.status(400).json({message: 'Winner has already been selected for this slot. Bidding is closed.'});
        }

        const existingBid = await models.bids.findOne({
            where: {userId, slotDate, isActive: true}
        });

        if (existingBid) {
            if (bidAmount <= existingBid.bidAmount) {
                return res.status(400).json({message: 'New bid amount must be higher than your current bid of £' + existingBid.bidAmount});
            }

            await models.bids.update(
                {bidAmount, updatedBy: userId},
                {where: {id: existingBid.id, userId}}
            );

            logger.info(logVar + 'Bid updated for userId: ' + userId);
            return res.status(200).json({message: 'Bid updated successfully', data: {slotDate, bidAmount}});
        }

        await models.bids.create({
            userId,
            bidAmount,
            slotDate,
            isWinner: false,
            isActive: true,
            createdBy: userId,
            updatedBy: userId,
        });

        logger.info(logVar + 'Bid placed for userId: ' + userId);
        return res.status(201).json({message: 'Bid placed successfully', data: {slotDate, bidAmount}});

    } catch (error) {
        logger.error(logVar + 'Error placing bid: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

async function getBidStatus(req, res) {
    logger.info(logVar + 'In getBidStatus');

    const userId = req.user?.userId;
    const slotDate = getTomorrowDate();

    try {
        const existingBid = await models.bids.findOne({
            where: {userId, slotDate, isActive: true}
        });

        if (!existingBid) {
            return res.status(200).json({
                data: {hasBid: false, message: 'You have not placed a bid for tomorrow'}
            });
        }

        const highestBid = await models.bids.findOne({
            where: {slotDate, isActive: true},
            order: [['bidAmount', 'DESC']],
        });

        const isWinning = highestBid && highestBid.userId === userId;

        return res.status(200).json({
            data: {
                hasBid: true,
                slotDate,
                isWinning,
                status: isWinning ? 'winning' : 'losing',
                message: isWinning
                    ? 'You are currently winning!'
                    : 'You are currently losing. Consider increasing your bid.',
            }
        });

    } catch (error) {
        logger.error(logVar + 'Error getting bid status: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

async function getBidHistory(req, res) {
    logger.info(logVar + 'In getBidHistory');

    const userId = req.user?.userId;

    try {
        const history = await models.bids.findAll({
            where: {userId},
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({data: history});

    } catch (error) {
        logger.error(logVar + 'Error getting bid history: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

async function getMonthlyLimitStatus(req, res) {
    logger.info(logVar + 'In getMonthlyLimitStatus');

    const userId = req.user?.userId;

    try {
        const winCount = await getMonthlyWinCount(userId);
        const eventCount = await getUserEventCountThisMonth(userId);
        const maxWins = eventCount > 0 ? 4 : 3;
        const remainingWins = maxWins - winCount;

        return res.status(200).json({
            data: {
                winsThisMonth: winCount,
                maxWins,
                remainingWins,
                hasEventBonus: eventCount > 0,
                message: `You have used ${winCount}/${maxWins} wins this month`
            }
        });

    } catch (error) {
        logger.error(logVar + 'Error getting monthly limit: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

async function getTomorrowSlot(req, res) {
    logger.info(logVar + 'In getTomorrowSlot');

    const userId = req.user?.userId;
    const slotDate = getTomorrowDate();

    try {
        const existingBid = await models.bids.findOne({
            where: {userId, slotDate, isActive: true}
        });

        const biddingOpen = isBiddingOpen();
        const winnerAlreadySelected = await getAlumniOfTheDayRecord(slotDate);

        return res.status(200).json({
            data: {
                slotDate,
                biddingOpen: biddingOpen && !winnerAlreadySelected,
                biddingClosesAt: '18:00',
                winnerSelected: !!winnerAlreadySelected,
                hasBid: !!existingBid,
                currentBidAmount: existingBid ? existingBid.bidAmount : null,
            }
        });

    } catch (error) {
        logger.error(logVar + 'Error getting tomorrow slot: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

async function getAlumniOfTheDay(req, res) {
    logger.info(logVar + 'In getAlumniOfTheDay');

    const {date} = req.params;

    if (!date) {
        return res.status(400).json({message: 'Date is required'});
    }

    try {
        const alumni = await getAlumniOfTheDayRecord(date);

        if (!alumni) {
            return res.status(200).json({
                data: null,
                message: 'No Alumni of the Day for ' + date
            });
        }

        return res.status(200).json({data: alumni});

    } catch (error) {
        logger.error(logVar + 'Error getting alumni of the day: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

module.exports = {
    placeBid,
    getBidStatus,
    getBidHistory,
    getMonthlyLimitStatus,
    getTomorrowSlot,
    getAlumniOfTheDay,
};
