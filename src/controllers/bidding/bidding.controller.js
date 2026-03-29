const logger = require('../../utils/logger');
const logVar = 'Controller | biddingController | ';

module.exports = function buildBiddingController(biddingService) {
    return Object.freeze({
        placeBid,
        getBidStatus,
        getBidHistory,
        getMonthlyLimitStatus,
        getTomorrowSlot,
        getAlumniOfTheDay,
    });

    async function placeBid(httpRequest) {
        logger.info(logVar + 'In placeBid controller');
        const headers = {'Content-Type': 'application/json'};
        const userId = httpRequest.user?.userId;
        const {bidAmount} = httpRequest.body;

        if (!bidAmount) {
            logger.warn(logVar + 'Missing bid amount');
            return {
                headers,
                statusCode: 400,
                body: {message: 'Bid amount is required'}
            };
        }

        try {
            const data = await biddingService.placeBid(userId, bidAmount);
            return {
                headers,
                statusCode: data.statusCode,
                body: {message: data.message, data: data.data}
            };
        } catch (error) {
            logger.error(logVar + 'Error placing bid: ' + error.message);
            return {headers, statusCode: 400, body: {message: error.message}};
        }
    }

    async function getBidStatus(httpRequest) {
        logger.info(logVar + 'In getBidStatus controller');
        const headers = {'Content-Type': 'application/json'};
        const userId = httpRequest.user?.userId;

        try {
            const data = await biddingService.getBidStatus(userId);
            return {headers, statusCode: 200, body: {data: data.data}};
        } catch (error) {
            logger.error(logVar + 'Error getting bid status: ' + error.message);
            return {headers, statusCode: 400, body: {message: error.message}};
        }
    }

    async function getBidHistory(httpRequest) {
        logger.info(logVar + 'In getBidHistory controller');
        const headers = {'Content-Type': 'application/json'};
        const userId = httpRequest.user?.userId;

        try {
            const data = await biddingService.getBidHistory(userId);
            return {headers, statusCode: 200, body: {data: data.data}};
        } catch (error) {
            logger.error(logVar + 'Error getting bid history: ' + error.message);
            return {headers, statusCode: 400, body: {message: error.message}};
        }
    }

    async function getMonthlyLimitStatus(httpRequest) {
        logger.info(logVar + 'In getMonthlyLimitStatus controller');
        const headers = {'Content-Type': 'application/json'};
        const userId = httpRequest.user?.userId;

        try {
            const data = await biddingService.getMonthlyLimitStatus(userId);
            return {headers, statusCode: 200, body: {data: data.data}};
        } catch (error) {
            logger.error(logVar + 'Error getting monthly limit: ' + error.message);
            return {headers, statusCode: 400, body: {message: error.message}};
        }
    }

    async function getTomorrowSlot(httpRequest) {
        logger.info(logVar + 'In getTomorrowSlot controller');
        const headers = {'Content-Type': 'application/json'};
        const userId = httpRequest.user?.userId;

        try {
            const data = await biddingService.getTomorrowSlot(userId);
            return {headers, statusCode: 200, body: {data: data.data}};
        } catch (error) {
            logger.error(logVar + 'Error getting tomorrow slot: ' + error.message);
            return {headers, statusCode: 400, body: {message: error.message}};
        }
    }

    async function getAlumniOfTheDay(httpRequest) {
        logger.info(logVar + 'In getAlumniOfTheDay controller');
        const headers = {'Content-Type': 'application/json'};
        const {date} = httpRequest.params;

        if (!date) {
            return {headers, statusCode: 400, body: {message: 'Date is required'}};
        }

        try {
            const data = await biddingService.getAlumniOfTheDay(date);
            return {headers, statusCode: 200, body: {data: data.data, message: data.message}};
        } catch (error) {
            logger.error(logVar + 'Error getting alumni of the day: ' + error.message);
            return {headers, statusCode: 400, body: {message: error.message}};
        }
    }
}
