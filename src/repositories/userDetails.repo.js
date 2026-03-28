const logger = require('../utils/logger');
const logVar = 'Repositories | userDetails.repo | ';

module.exports = function buildUserDetailsRepository(models) {
    return Object.freeze({
        createUserDetails,
        updateUserDetails,
        findUserDetailsByUserId,
        findAllUserDetails,
        createDegrees,
        createCertifications,
        createLicences,
        createCourses,
        deleteAllDegrees,
        deleteAllCertifications,
        deleteAllLicences,
        deleteAllCourses,
        findAllQualifications,
        createUserEmployment,
        updateUserEmployment,
        findAllUserEmployment,
        createProfileImage,
        softDeleteProfileImage,
        findActiveProfileImage
    })

    async function createUserDetails(data) {
        logger.info(logVar + 'Creating user details for userId: ' + data.userId);
        return models.userDetails.create(data);
    }

    async function updateUserDetails(userId, data) {
        logger.info(logVar + 'Updating user details for userId: ' + userId);
        return await models.userDetails.update(data, {where: {userId}});
    }

    async function findUserDetailsByUserId(userId) {
        logger.info(logVar + 'Finding user details for userId: ' + userId);
        return await models.userDetails.findOne({
            where: { userId },
            attributes: { exclude: ['profileImageId'] },
            include: [
                {
                    model: models.profileImages,
                    as: 'profileImages',
                    where: { isDeleted: false },
                    required: false,
                },
                {
                    model: models.degrees,
                    as: 'degrees',
                    required: false,
                },
                {
                    model: models.certifications,
                    as: 'certifications',
                    required: false,
                },
                {
                    model: models.licences,
                    as: 'licences',
                    required: false,
                },
                {
                    model: models.professionalCourses,
                    as: 'professionalCourses',
                    required: false,
                },
                {
                    model: models.employmentHistory,
                    as: 'employmentHistory',
                    required: false,
                },
            ]
        });
    }

    async function findAllUserDetails() {
        logger.info(logVar + 'Finding all user details');
        return await models.userDetails.findAll({
            include: [
                {model: models.profileImages, as: 'profileImages'},
                {model: models.degrees, as: 'degrees'},
                {model: models.certifications, as: 'certifications'},
                {model: models.licences, as: 'licences'},
                {model: models.professionalCourses, as: 'professionalCourses'},
                {model: models.employmentHistory, as: 'employmentHistory'},
            ]
        });
    }

    async function createDegrees(userId, degrees) {
        logger.info(logVar + 'Creating degrees for userId: ' + userId);
        const data = degrees.map(d => ({...d, userId, createdBy: userId, updatedBy: userId}));
        return await models.degrees.bulkCreate(data);
    }

    async function createCertifications(userId, certifications) {
        logger.info(logVar + 'Creating certifications for userId: ' + userId);
        const data = certifications.map(c => ({...c, userId, createdBy: userId, updatedBy: userId}));
        return await models.certifications.bulkCreate(data);
    }

    async function createLicences(userId, licences) {
        logger.info(logVar + 'Creating licences for userId: ' + userId);
        const data = licences.map(l => ({...l, userId, createdBy: userId, updatedBy: userId}));
        return await models.licences.bulkCreate(data);
    }

    async function createCourses(userId, courses) {
        logger.info(logVar + 'Creating courses for userId: ' + userId);
        const data = courses.map(c => ({...c, userId, createdBy: userId, updatedBy: userId}));
        return await models.professionalCourses.bulkCreate(data);
    }

    async function deleteAllDegrees(userId) {
        logger.info(logVar + 'Deleting all degrees for userId: ' + userId);
        return await models.degrees.destroy({where: {userId}});
    }

    async function deleteAllCertifications(userId) {
        logger.info(logVar + 'Deleting all certifications for userId: ' + userId);
        return await models.certifications.destroy({where: {userId}});
    }

    async function deleteAllLicences(userId) {
        logger.info(logVar + 'Deleting all licences for userId: ' + userId);
        return await models.licences.destroy({where: {userId}});
    }

    async function deleteAllCourses(userId) {
        logger.info(logVar + 'Deleting all courses for userId: ' + userId);
        return await models.professionalCourses.destroy({where: {userId}});
    }

    async function findAllQualifications(userId) {
        logger.info(logVar + 'Finding all qualifications for userId: ' + userId);

        const [degrees, certifications, licences, courses] = await Promise.all([
            models.degrees.findAll({where: {userId}}),
            models.certifications.findAll({where: {userId}}),
            models.licences.findAll({where: {userId}}),
            models.professionalCourses.findAll({where: {userId}}),
        ]);

        return {degrees, certifications, licences, courses};
    }

    async function createUserEmployment(userId, employment) {
        logger.info(logVar + 'Creating employment history for userId: ' + userId);
        const data = employment.map(e => ({
            ...e,
            userId,
            endDate: e.isCurrent ? null : e.endDate,
            createdBy: userId,
            updatedBy: userId
        }));
        return await models.employmentHistory.bulkCreate(data);
    }

    async function updateUserEmployment(uuid, userId, data) {
        logger.info(logVar + 'Updating employment for uuid: ' + uuid);
        return await models.employmentHistory.update(
            {
                ...data,
                endDate: data.isCurrent ? null : data.endDate,
                updatedBy: userId
            },
            {where: {uuid, userId}}
        );
    }

    async function findAllUserEmployment(userId) {
        logger.info(logVar + 'Finding all employment history for userId: ' + userId);
        return await models.employmentHistory.findAll({where: {userId}});
    }

    async function createProfileImage(data) {
        logger.info(logVar + 'Creating profile image for userId: ' + data.userId);
        return await models.profileImages.create(data);
    }

    async function softDeleteProfileImage(userId) {
        logger.info(logVar + 'Soft deleting profile image for userId: ' + userId);
        return await models.profileImages.update(
            {isDeleted: true, updatedBy: userId},
            {where: {userId, isDeleted: false}}
        );
    }

    async function findActiveProfileImage(userId) {
        logger.info(logVar + 'Finding active profile image for userId: ' + userId);
        return await models.profileImages.findOne({
            where: {userId, isDeleted: false}
        });
    }
}
