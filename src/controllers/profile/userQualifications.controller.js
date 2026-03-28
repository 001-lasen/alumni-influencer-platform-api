const logger = require('../../utils/logger');
const logVar = 'Controller | userQualificationsController | ';

module.exports = function buildUserQualificationsController(qualificationsService) {
    return Object.freeze({
        createQualifications,
        updateQualifications,
        getQualifications,
    });

    async function createQualifications(httpRequest) {
        logger.info(logVar + 'In createQualifications controller');
        const headers = {'Content-Type': 'application/json'};
        const userId = httpRequest.user?.userId;

        try {
            const data = await qualificationsService.createQualifications(userId, httpRequest.body);
            return {headers, statusCode: 201, body: {message: data.message}};
        } catch (error) {
            logger.error(logVar + 'Error creating qualifications: ' + error.message);
            return {headers, statusCode: 400, body: {message: error.message}};
        }
    }

    async function updateQualifications(httpRequest) {
        logger.info(logVar + 'In updateQualifications controller');
        const headers = {'Content-Type': 'application/json'};
        const userId = httpRequest.user?.userId;

        try {
            const data = await qualificationsService.updateQualifications(userId, httpRequest.body);
            return {headers, statusCode: 200, body: {message: data.message}};
        } catch (error) {
            logger.error(logVar + 'Error updating qualifications: ' + error.message);
            return {headers, statusCode: 400, body: {message: error.message}};
        }
    }

    async function getQualifications(httpRequest) {
        logger.info(logVar + 'In getQualifications controller');
        const headers = {'Content-Type': 'application/json'};
        const userId = httpRequest.user?.userId;

        try {
            const data = await qualificationsService.getQualifications(userId);
            return {headers, statusCode: 200, body: {data: data.data}};
        } catch (error) {
            logger.error(logVar + 'Error getting qualifications: ' + error.message);
            return {headers, statusCode: 400, body: {message: error.message}};
        }
    }
}
