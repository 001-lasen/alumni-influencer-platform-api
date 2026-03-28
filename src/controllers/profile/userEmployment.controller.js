const logger = require('../../utils/logger');
const logVar = 'Controller | userEmploymentController | ';

module.exports = function buildUserEmploymentController(employmentService) {
    return Object.freeze({
        createEmployment,
        updateEmployment,
        getEmployment,
    });

    async function createEmployment(httpRequest) {
        logger.info(logVar + 'In createEmployment controller');
        const headers = {'Content-Type': 'application/json'};
        const userId = httpRequest.user?.userId;

        try {
            const data = await employmentService.createEmployment(userId, httpRequest.body);
            return {headers, statusCode: 201, body: {message: data.message}};
        } catch (error) {
            logger.error(logVar + 'Error creating employment: ' + error.message);
            return {headers, statusCode: 400, body: {message: error.message}};
        }
    }

    async function updateEmployment(httpRequest) {
        logger.info(logVar + 'In updateEmployment controller');
        const headers = {'Content-Type': 'application/json'};
        const userId = httpRequest.user?.userId;

        try {
            const data = await employmentService.updateEmployment(userId, httpRequest.body);
            return {headers, statusCode: 200, body: {message: data.message}};
        } catch (error) {
            logger.error(logVar + 'Error updating employment: ' + error.message);
            return {headers, statusCode: 400, body: {message: error.message}};
        }
    }

    async function getEmployment(httpRequest) {
        logger.info(logVar + 'In getEmployment controller');
        const headers = {'Content-Type': 'application/json'};
        const userId = httpRequest.user?.userId;

        try {
            const data = await employmentService.getEmployment(userId);
            return {headers, statusCode: 200, body: {data: data.data}};
        } catch (error) {
            logger.error(logVar + 'Error getting employment: ' + error.message);
            return {headers, statusCode: 400, body: {message: error.message}};
        }
    }
}
