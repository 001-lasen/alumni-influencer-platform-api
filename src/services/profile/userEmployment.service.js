const logger = require('../../utils/logger');
const logVar = 'Services | userEmploymentService | ';

module.exports = function buildUserEmploymentService(userDetailsRepository) {
    return Object.freeze({
        createEmployment,
        updateEmployment,
        getEmployment,
    });

    async function createEmployment(userId, data) {
        logger.info(logVar + 'In createEmployment service for userId: ' + userId);

        const {employment = []} = data;

        if (employment.length === 0) {
            throw new Error('At least one employment entry is required');
        }

        for (const entry of employment) {
            if (!entry.companyName || !entry.jobTitle || !entry.startDate) {
                throw new Error('companyName, jobTitle and startDate are required for each entry');
            }
            if (!entry.isCurrent && !entry.endDate) {
                throw new Error('endDate is required when isCurrent is false');
            }
        }

        await userDetailsRepository.createUserEmployment(userId, employment);

        logger.info(logVar + 'Employment created for userId: ' + userId);
        return {statusCode: 201, message: 'Employment history created successfully'};
    }

    async function updateEmployment(userId, data) {
        logger.info(logVar + 'In updateEmployment service for userId: ' + userId);

        const {employment = []} = data;

        if (employment.length === 0) {
            throw new Error('At least one employment entry is required');
        }

        for (const entry of employment) {
            if (!entry.companyName || !entry.jobTitle || !entry.startDate) {
                throw new Error('companyName, jobTitle and startDate are required for each entry');
            }
            if (!entry.isCurrent && !entry.endDate) {
                throw new Error('endDate is required when isCurrent is false');
            }

            if (entry.uuid) {
                await userDetailsRepository.updateUserEmployment(entry.uuid, userId, entry);
            } else {
                await userDetailsRepository.createUserEmployment(userId, [entry]);
            }
        }

        logger.info(logVar + 'Employment updated for userId: ' + userId);
        return {statusCode: 200, message: 'Employment history updated successfully'};
    }

    async function getEmployment(userId) {
        logger.info(logVar + 'In getEmployment service for userId: ' + userId);
        const employment = await userDetailsRepository.findAllUserEmployment(userId);
        return {statusCode: 200, data: employment};
    }
}
