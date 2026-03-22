const logger = require('../utils/logger');
const logVar = 'Repositories | userDetails.repo | ';

module.exports = function buildUserDetailsRepository(models) {
    return Object.freeze({
        createUserDetails,
        updateUserDetails,
        findUserDetailsByUserId,
        findAllUserDetails,

    })

    async function createUserDetails(data) {
        logger.info(logVar + 'Creating user details for userId: ' + data.userId);
        return models.userDetails.create(data);
    }

    async function updateUserDetails(userId, data) {
        logger.info(logVar + 'Updating user details for userId: ' + userId);
        return await models.userDetails.update(data, { where: { userId } });
    }

    async function findUserDetailsByUserId(userId) {
        logger.info(logVar + 'Finding user details for userId: ' + userId);
        return await models.userDetails.findOne({ where: { userId } });
    }

    async function findAllUserDetails() {
        logger.info(logVar + 'Finding all user details');
        return await models.userDetails.findAll({
            include: [
                { model: models.profileImages, as: 'profileImages' },
                { model: models.degrees, as: 'degrees' },
                { model: models.certifications, as: 'certifications' },
                { model: models.licences, as: 'licences' },
                { model: models.professionalCourses, as: 'professionalCourses' },
                { model: models.employmentHistory, as: 'employmentHistory' },
            ]
        });
    }
}
