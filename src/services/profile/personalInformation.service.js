const logger = require('../../utils/logger');
const logVar = ' Services | personalInfoService | ';

module.exports = function buildPersonalInfoService(userDetailsRepository) {
    return Object.freeze({
        createPersonalInfo,
        updatePersonalInfo,
        getPersonalInfo,
    });

    async function createPersonalInfo(userId, data) {
        logger.info(logVar + 'In createPersonalInfo service for userId: ' + userId);

        const existing = await userDetailsRepository.findUserDetailsByUserId(userId);
        if (existing) {
            logger.error(logVar + 'Personal info already exists for user ID: ' + userId);
            throw new Error('Personal info already exists');
        }

        const userDetails = {
            userId,
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.userName,
            contactNumber: data.contactNumber || null,
            email: data.email,
            linkedInProfile: data.linkedInProfile || null,
            biography: data.biography || null,
        };

        const created = await userDetailsRepository.createUserDetails(userDetails);
        logger.info(logVar + 'Personal info created for userId: ' + userId);
        return {
            statusCode: 201,
            data: created
        };
    }

    async function updatePersonalInfo(userId, data) {
        logger.info(logVar + 'In updatePersonalInfo service for userId: ' + userId);

        const existing = await userDetailsRepository.findUserDetailsByUserId(userId);
        if (!existing) {
            logger.error(logVar + 'Personal info not found for user ID: ' + userId);
            throw new Error('Personal info not found.');
        }

        const updatedData = {
            firstName: data.firstName || existing.firstName,
            lastName: data.lastName || existing.lastName,
            userName: data.userName || existing.userName,
            contactNumber: data.contactNumber || existing.contactNumber,
            email: data.email || existing.email,
            linkedInProfile: data.linkedInProfile || existing.linkedInProfile,
            biography: data.biography || existing.biography,
            updatedBy: userId,
        };

        await userDetailsRepository.updateUserDetails(userId, updatedData);
        logger.info(logVar + 'Personal info updated for userId: ' + userId);
        return {
            statusCode: 200,
            message: 'Personal info updated successfully'
        };
    }

    async function getPersonalInfo(userId) {
        logger.info(logVar + 'In getPersonalInfo service for userId: ' + userId);

        const userDetails = await userDetailsRepository.findUserDetailsByUserId(userId);
        if (!userDetails) {
            logger.error(logVar + 'Personal info not found for user ID: ' + userId);
            throw new Error('Personal info not found');
        }

        return {
            statusCode: 200,
            data: userDetails
        };
    }
}
