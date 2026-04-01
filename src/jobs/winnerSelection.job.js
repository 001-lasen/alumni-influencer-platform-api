const logger = require('../utils/logger');
const logVar = 'Jobs | winnerSelectionJob | ';
const {sendWinnerNotificationEmail} = require('../utils/emailUtil');
const {Op} = require('sequelize');

module.exports = function buildWinnerSelectionJob(models) {

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

    async function selectWinner() {
        logger.info(logVar + 'Running winner selection job');

        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const slotDate = tomorrow.toISOString().split('T')[0];

            const highestBid = await models.bids.findOne({
                where: {slotDate, isActive: true},
                order: [['bidAmount', 'DESC']],
            });

            if (!highestBid) {
                logger.info(logVar + 'No bids found for slotDate: ' + slotDate);
                return;
            }

            const winCount = await getMonthlyWinCount(highestBid.userId);
            const eventCount = await getUserEventCountThisMonth(highestBid.userId);
            const maxWins = eventCount > 0 ? 4 : 3;

            let winner = highestBid;

            if (winCount >= maxWins) {
                logger.warn(logVar + 'Highest bidder reached monthly limit, finding next eligible bidder');

                const allBids = await models.bids.findAll({
                    where: {slotDate, isActive: true},
                    order: [['bidAmount', 'DESC']],
                });

                winner = null;

                for (const bid of allBids) {
                    const bidderWinCount = await getMonthlyWinCount(bid.userId);
                    const bidderEventCount = await getUserEventCountThisMonth(bid.userId);
                    const bidderMaxWins = bidderEventCount > 0 ? 4 : 3;

                    if (bidderWinCount < bidderMaxWins) {
                        winner = bid;
                        break;
                    }
                }

                if (!winner) {
                    logger.warn(logVar + 'No eligible bidder found for slotDate: ' + slotDate);
                    return;
                }
            }

            await models.bids.update(
                {isWinner: true},
                {where: {id: winner.id}}
            );

            await models.alumniOfTheDay.create({
                userId: winner.userId,
                bidId: winner.id,
                slotDate,
                isActive: true,
            });

            // send winner notification email
            const winnerDetails = await models.users.findOne({
                where: {id: winner.userId},
                include: [{model: models.userDetails, as: 'details'}]
            });

            if (winnerDetails && winnerDetails.details) {
                await sendWinnerNotificationEmail(
                    winnerDetails.email,
                    winnerDetails.details.firstName,
                    slotDate
                );
            }

            logger.info(logVar + 'Winner selected: userId ' + winner.userId + ' for slotDate: ' + slotDate);

        } catch (error) {
            logger.error(logVar + 'Error selecting winner: ' + error.message);
        }
    }

    return {selectWinner};
}
