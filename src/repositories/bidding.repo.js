const logger = require('../utils/logger');
const logVar = 'Repositories | bidding.repo | ';
const { Op } = require('sequelize');

module.exports = function buildBiddingRepository(models) {
    return Object.freeze({
        placeBid,
        findActiveBidByUserId,
        updateBidAmount,
        findHighestBidForSlot,
        findAllBidsForSlot,
        markBidAsWinner,
        getUserBidHistory,
        getMonthlyWinCount,
        getUserEventCountThisMonth,
        createAlumniOfTheDay,
        getAlumniOfTheDay,
    });

    async function placeBid(userId, bidAmount, slotDate) {
        logger.info(logVar + 'Placing bid for userId: ' + userId);
        return await models.bids.create({
            userId,
            bidAmount,
            slotDate,
            isWinner: false,
            isActive: true,
            createdBy: userId,
            updatedBy: userId,
        });
    }

    async function findActiveBidByUserId(userId, slotDate) {
        logger.info(logVar + 'Finding active bid for userId: ' + userId);
        return await models.bids.findOne({
            where: {userId, slotDate, isActive: true}
        });
    }

    async function updateBidAmount(bidId, userId, bidAmount) {
        logger.info(logVar + 'Updating bid amount for bidId: ' + bidId);
        return await models.bids.update(
            {bidAmount, updatedBy: userId},
            {where: {id: bidId, userId}}
        );
    }

    async function findHighestBidForSlot(slotDate) {
        logger.info(logVar + 'Finding highest bid for slotDate: ' + slotDate);
        return await models.bids.findOne({
            where: {slotDate, isActive: true},
            order: [['bidAmount', 'DESC']],
        });
    }

    async function findAllBidsForSlot(slotDate) {
        logger.info(logVar + 'Finding all bids for slotDate: ' + slotDate);
        return await models.bids.findAll({
            where: {slotDate, isActive: true},
            order: [['bidAmount', 'DESC']],
        });
    }

    async function markBidAsWinner(bidId) {
        logger.info(logVar + 'Marking bid as winner for bidId: ' + bidId);
        return await models.bids.update(
            {isWinner: true},
            {where: {id: bidId}}
        );
    }

    async function getUserBidHistory(userId) {
        logger.info(logVar + 'Getting bid history for userId: ' + userId);
        return await models.bids.findAll({
            where: {userId},
            order: [['createdAt', 'DESC']],
        });
    }

    async function getMonthlyWinCount(userId) {
        logger.info(logVar + 'Getting monthly win count for userId: ' + userId);
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return await models.bids.count({
            where: {
                userId,
                isWinner: true,
                slotDate: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });
    }

    async function getUserEventCountThisMonth(userId) {
        logger.info(logVar + 'Getting event count for userId: ' + userId);
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return await models.alumniEvents.count({
            where: {
                userId,
                eventDate: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });
    }

    async function createAlumniOfTheDay(userId, bidId, slotDate) {
        logger.info(logVar + 'Creating alumni of the day for userId: ' + userId);
        return await models.alumniOfTheDay.create({
            userId,
            bidId,
            slotDate,
            isActive: true,
        });
    }

    async function getAlumniOfTheDay(slotDate) {
        logger.info(logVar + 'Getting alumni of the day for slotDate: ' + slotDate);
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
}
