const logger = require('../../utils/logger');
const logVar = 'Services | biddingService | ';

module.exports = function buildBiddingService(biddingRepository) {
    return Object.freeze({
        placeBid,
        getBidStatus,
        getBidHistory,
        getMonthlyLimitStatus,
        getTomorrowSlot,
        getAlumniOfTheDay,
    });

    async function placeBid(userId, bidAmount) {
        logger.info(logVar + 'In placeBid service for userId: ' + userId);

        if (!bidAmount || bidAmount <= 0) {
            throw new Error('Bid amount must be greater than 0');
        }

        if (!isBiddingOpen()) {
            throw new Error('Bidding is closed. Winner has already been selected for today.');
        }

        const winCount = await biddingRepository.getMonthlyWinCount(userId);
        const eventCount = await biddingRepository.getUserEventCountThisMonth(userId);
        const maxWins = eventCount > 0 ? 4 : 3;

        if (winCount >= maxWins) {
            throw new Error(`You have reached your monthly limit of ${maxWins} wins this month`);
        }

        const slotDate = getTomorrowDate();

        const existingBid = await biddingRepository.findActiveBidByUserId(userId, slotDate);

        if (existingBid) {
            if (bidAmount <= existingBid.bidAmount) {
                throw new Error('New bid amount must be higher than your current bid of £' + existingBid.bidAmount);
            }

            await biddingRepository.updateBidAmount(existingBid.id, userId, bidAmount);

            logger.info(logVar + 'Bid updated successfully for userId: ' + userId);
            return {
                statusCode: 200,
                message: 'Bid updated successfully',
                data: {slotDate, bidAmount}
            };
        }

        await biddingRepository.placeBid(userId, bidAmount, slotDate);

        logger.info(logVar + 'Bid placed successfully for userId: ' + userId);
        return {
            statusCode: 201,
            message: 'Bid placed successfully',
            data: {slotDate, bidAmount}
        };
    }

    async function getBidStatus(userId) {
        logger.info(logVar + 'In getBidStatus service for userId: ' + userId);

        const slotDate = getTomorrowDate();
        const existingBid = await biddingRepository.findActiveBidByUserId(userId, slotDate);

        if (!existingBid) {
            return {
                statusCode: 200,
                data: {
                    hasBid: false,
                    message: 'You have not placed a bid for tomorrow'
                }
            };
        }

        const highestBid = await biddingRepository.findHighestBidForSlot(slotDate);
        const isWinning = highestBid && highestBid.userId === userId;

        return {
            statusCode: 200,
            data: {
                hasBid: true,
                slotDate,
                isWinning,
                status: isWinning ? 'winning' : 'losing',
                message: isWinning
                    ? 'You are currently winning!'
                    : 'You are currently losing. Consider increasing your bid.',
            }
        };
    }

    async function getBidHistory(userId) {
        logger.info(logVar + 'In getBidHistory service for userId: ' + userId);
        const history = await biddingRepository.getUserBidHistory(userId);
        return {statusCode: 200, data: history};
    }

    async function getMonthlyLimitStatus(userId) {
        logger.info(logVar + 'In getMonthlyLimitStatus service for userId: ' + userId);

        const winCount = await biddingRepository.getMonthlyWinCount(userId);
        const eventCount = await biddingRepository.getUserEventCountThisMonth(userId);
        const maxWins = eventCount > 0 ? 4 : 3;
        const remainingWins = maxWins - winCount;

        return {
            statusCode: 200,
            data: {
                winsThisMonth: winCount,
                maxWins,
                remainingWins,
                hasEventBonus: eventCount > 0,
                message: `You have used ${winCount}/${maxWins} wins this month`
            }
        };
    }

    async function getTomorrowSlot(userId) {
        logger.info(logVar + 'In getTomorrowSlot service for userId: ' + userId);

        const slotDate = getTomorrowDate();
        const existingBid = await biddingRepository.findActiveBidByUserId(userId, slotDate);
        const biddingOpen = isBiddingOpen();

        return {
            statusCode: 200,
            data: {
                slotDate,
                biddingOpen,
                biddingClosesAt: '18:00',
                hasBid: !!existingBid,
                currentBidAmount: existingBid ? existingBid.bidAmount : null,
            }
        };
    }

    async function getAlumniOfTheDay() {
        logger.info(logVar + 'In getAlumniOfTheDay service');

        const today = new Date().toISOString().split('T')[0];
        const alumni = await biddingRepository.getAlumniOfTheDay(today);

        if (!alumni) {
            return {
                statusCode: 200,
                data: null,
                message: 'No Alumni of the Day for today'
            };
        }

        return {statusCode: 200, data: alumni};
    }

    function getTomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    function isBiddingOpen() {
        const now = new Date();
        return now.getHours() < 18;
    }
}
