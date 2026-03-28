const logger = require('../../utils/logger');
const logVar = 'Controller | profileImageController | ';

module.exports = function buildProfileImageController(profileImageService) {
    return Object.freeze({
        uploadProfileImage,
        getProfileImage,
    });

    async function uploadProfileImage(httpRequest) {
        logger.info(logVar + 'In uploadProfileImage controller');
        const headers = {'Content-Type': 'application/json'};
        const userId = httpRequest.user?.userId;
        const file = httpRequest.file;

        if (!file) {
            logger.warn(logVar + 'No file provided in request');
            return {
                headers,
                statusCode: 400,
                body: {message: 'No image file provided'}
            };
        }

        try {
            const data = await profileImageService.uploadProfileImage(userId, file);
            return {
                headers,
                statusCode: 201,
                body: {message: data.message, data: data.data}
            };
        } catch (error) {
            logger.error(logVar + 'Error uploading profile image: ' + error.message);
            return {headers, statusCode: 400, body: {message: error.message}};
        }
    }

    async function getProfileImage(httpRequest) {
        logger.info(logVar + 'In getProfileImage controller');
        const headers = {'Content-Type': 'application/json'};
        const userId = httpRequest.user?.userId;

        try {
            const data = await profileImageService.getProfileImage(userId);
            return {headers, statusCode: 200, body: {data: data.data}};
        } catch (error) {
            logger.error(logVar + 'Error getting profile image: ' + error.message);
            return {headers, statusCode: 404, body: {message: error.message}};
        }
    }
}
