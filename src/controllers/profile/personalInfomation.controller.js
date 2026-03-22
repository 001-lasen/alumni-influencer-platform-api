const logger = require('../../utils/logger');
const logVar = ' Controller | personalInfoController | ';

module.exports = function buildPersonalInfoController(personalInfoService) {
    return Object.freeze({
        createPersonalInfo,
        updatePersonalInfo,
        getPersonalInfo,
    });

    async function createPersonalInfo(httpRequest) {
        logger.info(logVar + 'In createPersonalInfo controller');
        const headers = { 'Content-Type': 'application/json' };
        const userId = httpRequest.user?.userId;
        const { firstName, lastName, userName, email } = httpRequest.body;

        if (!firstName || !lastName || !userName || !email) {
            return {
                headers,
                statusCode: 400,
                body: { message: 'firstName, lastName, userName and email are required' }
            };
        }

        try {
            const data = await personalInfoService.createPersonalInfo(userId, httpRequest.body);
            return {
                headers,
                statusCode: 201,
                body: {
                    message: 'Personal info created',
                    data: data.data
                }
            };
        } catch (error) {
            logger.error(logVar + 'Error creating personal info: ' + error.message);
            return {
                headers,
                statusCode: 400,
                body: {
                    message: error.message
                }
            };
        }
    }

    async function updatePersonalInfo(httpRequest) {
        logger.info(logVar + 'In updatePersonalInfo controller');
        const headers = { 'Content-Type': 'application/json' };
        const userId = httpRequest.user?.userId;

        try {
            const data = await personalInfoService.updatePersonalInfo(userId, httpRequest.body);
            return {
                headers,
                statusCode: 200,
                body: {
                    message: data.message
                }
            };
        } catch (error) {
            logger.error(logVar + 'Error updating personal info: ' + error.message);
            return {
                headers,
                statusCode: 400,
                body: {
                    message: error.message
                }
            };
        }
    }

    async function getPersonalInfo(httpRequest) {
        logger.info(logVar + 'In getPersonalInfo controller');
        const headers = { 'Content-Type': 'application/json' };
        const userId = httpRequest.user?.userId;

        try {
            const data = await personalInfoService.getPersonalInfo(userId);
            return {
                headers,
                statusCode: 200,
                body: {
                    data: data.data
                }
            };
        } catch (error) {
            logger.error(logVar + 'Error getting personal info: ' + error.message);
            return {
                headers,
                statusCode: 404,
                body: {
                    message: error.message
                }
            };
        }
    }
}
