const logger = require('../../utils/logger');
const logVar = 'Services | userQualificationsService | ';

module.exports = function buildUserQualificationsService(userDetailsRepository) {
    return Object.freeze({
        createQualifications,
        updateQualifications,
        getQualifications,
    });

    async function createQualifications(userId, data) {
        logger.info(logVar + 'In createQualifications service for userId: ' + userId);

        const {degrees = [], certifications = [], licences = [], courses = []} = data;

        const existing = await userDetailsRepository.findAllQualifications(userId);
        const hasExisting =
            existing.degrees.length > 0 ||
            existing.certifications.length > 0 ||
            existing.licences.length > 0 ||
            existing.courses.length > 0;

        if (hasExisting) {
            throw new Error('Qualifications already exist.');
        }

        await Promise.all([
            degrees.length > 0 ? userDetailsRepository.createDegrees(userId, degrees) : Promise.resolve(),
            certifications.length > 0 ? userDetailsRepository.createCertifications(userId, certifications) : Promise.resolve(),
            licences.length > 0 ? userDetailsRepository.createLicences(userId, licences) : Promise.resolve(),
            courses.length > 0 ? userDetailsRepository.createCourses(userId, courses) : Promise.resolve(),
        ]);

        logger.info(logVar + 'Qualifications created for userId: ' + userId);
        return {statusCode: 201, message: 'Qualifications created successfully'};
    }

    async function updateQualifications(userId, data) {
        logger.info(logVar + 'In updateQualifications service for userId: ' + userId);

        const {degrees = [], certifications = [], licences = [], courses = []} = data;

        await Promise.all([
            userDetailsRepository.deleteAllDegrees(userId),
            userDetailsRepository.deleteAllCertifications(userId),
            userDetailsRepository.deleteAllLicences(userId),
            userDetailsRepository.deleteAllCourses(userId),
        ]);

        await Promise.all([
            degrees.length > 0 ? userDetailsRepository.createDegrees(userId, degrees) : Promise.resolve(),
            certifications.length > 0 ? userDetailsRepository.createCertifications(userId, certifications) : Promise.resolve(),
            licences.length > 0 ? userDetailsRepository.createLicences(userId, licences) : Promise.resolve(),
            courses.length > 0 ? userDetailsRepository.createCourses(userId, courses) : Promise.resolve(),
        ]);

        logger.info(logVar + 'Qualifications updated for userId: ' + userId);
        return {statusCode: 200, message: 'Qualifications updated successfully'};
    }

    async function getQualifications(userId) {
        logger.info(logVar + 'In getQualifications service for userId: ' + userId);
        const qualifications = await userDetailsRepository.findAllQualifications(userId);
        return {statusCode: 200, data: qualifications};
    }
}
