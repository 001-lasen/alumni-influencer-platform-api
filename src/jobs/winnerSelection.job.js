const logger = require('../utils/logger');
const logVar = 'Jobs | winnerSelectionJob | ';
const {sendWinnerNotificationEmail} = require('../utils/emailUtil');

module.exports = function buildWinnerSelectionJob(biddingRepository) {

    async function selectWinner() {
        logger.info(logVar + 'Running winner selection job');

        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const slotDate = tomorrow.toISOString().split('T')[0];

            const highestBid = await biddingRepository.findHighestBidForSlot(slotDate);

            if (!highestBid) {
                logger.info(logVar + 'No bids found for slotDate: ' + slotDate);
                return;
            }

            const winCount = await biddingRepository.getMonthlyWinCount(highestBid.userId);
            const eventCount = await biddingRepository.getUserEventCountThisMonth(highestBid.userId);
            const maxWins = eventCount > 0 ? 4 : 3;

            let winner = highestBid;

            if (winCount >= maxWins) {
                logger.warn(logVar + 'Highest bidder has reached monthly limit, finding next eligible bidder');

                const allBids = await biddingRepository.findAllBidsForSlot(slotDate);
                winner = null;

                for (const bid of allBids) {
                    const bidderWinCount = await biddingRepository.getMonthlyWinCount(bid.userId);
                    const bidderEventCount = await biddingRepository.getUserEventCountThisMonth(bid.userId);
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

            await biddingRepository.markBidAsWinner(winner.id);
            await biddingRepository.createAlumniOfTheDay(winner.userId, winner.id, slotDate);

            // send winner notification email
            const winnerDetails = await biddingRepository.getWinnerDetails(winner.userId);
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
