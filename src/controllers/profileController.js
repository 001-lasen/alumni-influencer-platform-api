const logger = require('../utils/logger');
const logVar = 'Controller | profileController | ';
const models = require('../models');
const {uploadToCloudinary} = require('../config/cloudinary');

async function findUserDetailsByUserId(userId) {
    return await models.userDetails.findOne({
        where: {userId},
        attributes: {exclude: ['profileImageId']},
        include: [
            {model: models.profileImages, as: 'profileImages', where: {isDeleted: false}, required: false},
            {model: models.degrees, as: 'degrees', required: false},
            {model: models.certifications, as: 'certifications', required: false},
            {model: models.licences, as: 'licences', required: false},
            {model: models.professionalCourses, as: 'professionalCourses', required: false},
            {model: models.employmentHistory, as: 'employmentHistory', required: false},
        ]
    });
}

async function createPersonalInfo(req, res) {
    logger.info(logVar + 'In createPersonalInfo');

    const userId = req.user?.userId;
    const {firstName, lastName, userName, email, contactNumber, linkedInProfile, biography} = req.body;

    if (!firstName || !lastName || !userName || !email) {
        return res.status(400).json({message: 'firstName, lastName, userName and email are required'});
    }

    try {
        const existing = await findUserDetailsByUserId(userId);
        if (existing) {
            return res.status(400).json({message: 'Personal info already exists. Use PUT to update.'});
        }

        const created = await models.userDetails.create({
            userId,
            firstName,
            lastName,
            userName,
            contactNumber: contactNumber || null,
            email,
            linkedInProfile: linkedInProfile || null,
            biography: biography || null,
            createdBy: userId,
            updatedBy: userId,
        });

        logger.info(logVar + 'Personal info created for userId: ' + userId);
        return res.status(201).json({message: 'Personal info created', data: created});

    } catch (error) {
        logger.error(logVar + 'Error creating personal info: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

async function updatePersonalInfo(req, res) {
    logger.info(logVar + 'In updatePersonalInfo');

    const userId = req.user?.userId;
    const {firstName, lastName, userName, contactNumber, email, linkedInProfile, biography} = req.body;

    try {
        const existing = await findUserDetailsByUserId(userId);
        if (!existing) {
            return res.status(404).json({message: 'Personal info not found. Use POST to create.'});
        }

        await models.userDetails.update(
            {
                firstName: firstName || existing.firstName,
                lastName: lastName || existing.lastName,
                userName: userName || existing.userName,
                contactNumber: contactNumber || existing.contactNumber,
                email: email || existing.email,
                linkedInProfile: linkedInProfile || existing.linkedInProfile,
                biography: biography || existing.biography,
                updatedBy: userId,
            },
            {where: {userId}}
        );

        logger.info(logVar + 'Personal info updated for userId: ' + userId);
        return res.status(200).json({message: 'Personal info updated successfully'});

    } catch (error) {
        logger.error(logVar + 'Error updating personal info: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

async function getPersonalInfo(req, res) {
    logger.info(logVar + 'In getPersonalInfo');

    const userId = req.user?.userId;

    try {
        const userDetails = await findUserDetailsByUserId(userId);
        if (!userDetails) {
            return res.status(404).json({message: 'Personal info not found'});
        }

        logger.info(logVar + 'Personal info retrieved for userId: ' + userId);
        return res.status(200).json({data: userDetails});

    } catch (error) {
        logger.error(logVar + 'Error getting personal info: ' + error.message);
        return res.status(500).json({message: error.message});
    }
}

async function createQualifications(req, res) {
    logger.info(logVar + 'In createQualifications');

    const userId = req.user?.userId;
    const {degrees = [], certifications = [], licences = [], courses = []} = req.body;

    try {
        const existing = await Promise.all([
            models.degrees.findAll({where: {userId}}),
            models.certifications.findAll({where: {userId}}),
            models.licences.findAll({where: {userId}}),
            models.professionalCourses.findAll({where: {userId}}),
        ]);

        const hasExisting = existing.some(result => result.length > 0);
        if (hasExisting) {
            return res.status(400).json({message: 'Qualifications already exist. Use PUT to update.'});
        }

        await Promise.all([
            degrees.length > 0 ? models.degrees.bulkCreate(degrees.map(d => ({
                ...d,
                userId,
                createdBy: userId,
                updatedBy: userId
            }))) : Promise.resolve(),
            certifications.length > 0 ? models.certifications.bulkCreate(certifications.map(c => ({
                ...c,
                userId,
                createdBy: userId,
                updatedBy: userId
            }))) : Promise.resolve(),
            licences.length > 0 ? models.licences.bulkCreate(licences.map(l => ({
                ...l,
                userId,
                createdBy: userId,
                updatedBy: userId
            }))) : Promise.resolve(),
            courses.length > 0 ? models.professionalCourses.bulkCreate(courses.map(c => ({
                ...c,
                userId,
                createdBy: userId,
                updatedBy: userId
            }))) : Promise.resolve(),
        ]);

        logger.info(logVar + 'Qualifications created for userId: ' + userId);
        return res.status(201).json({message: 'Qualifications created successfully'});

    } catch (error) {
        logger.error(logVar + 'Error creating qualifications: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

async function updateQualifications(req, res) {
    logger.info(logVar + 'In updateQualifications');

    const userId = req.user?.userId;
    const {degrees = [], certifications = [], licences = [], courses = []} = req.body;

    try {
        await Promise.all([
            models.degrees.destroy({where: {userId}}),
            models.certifications.destroy({where: {userId}}),
            models.licences.destroy({where: {userId}}),
            models.professionalCourses.destroy({where: {userId}}),
        ]);

        await Promise.all([
            degrees.length > 0 ? models.degrees.bulkCreate(degrees.map(d => ({
                ...d,
                userId,
                createdBy: userId,
                updatedBy: userId
            }))) : Promise.resolve(),
            certifications.length > 0 ? models.certifications.bulkCreate(certifications.map(c => ({
                ...c,
                userId,
                createdBy: userId,
                updatedBy: userId
            }))) : Promise.resolve(),
            licences.length > 0 ? models.licences.bulkCreate(licences.map(l => ({
                ...l,
                userId,
                createdBy: userId,
                updatedBy: userId
            }))) : Promise.resolve(),
            courses.length > 0 ? models.professionalCourses.bulkCreate(courses.map(c => ({
                ...c,
                userId,
                createdBy: userId,
                updatedBy: userId
            }))) : Promise.resolve(),
        ]);

        logger.info(logVar + 'Qualifications updated for userId: ' + userId);
        return res.status(200).json({message: 'Qualifications updated successfully'});

    } catch (error) {
        logger.error(logVar + 'Error updating qualifications: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

async function getQualifications(req, res) {
    logger.info(logVar + 'In getQualifications');

    const userId = req.user?.userId;

    try {
        const [degrees, certifications, licences, courses] = await Promise.all([
            models.degrees.findAll({where: {userId}}),
            models.certifications.findAll({where: {userId}}),
            models.licences.findAll({where: {userId}}),
            models.professionalCourses.findAll({where: {userId}}),
        ]);

        logger.info(logVar + 'Qualifications retrieved for userId: ' + userId);
        return res.status(200).json({data: {degrees, certifications, licences, courses}});

    } catch (error) {
        logger.error(logVar + 'Error getting qualifications: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

async function createEmployment(req, res) {
    logger.info(logVar + 'In createEmployment');

    const userId = req.user?.userId;
    const {employment = []} = req.body;

    if (employment.length === 0) {
        return res.status(400).json({message: 'At least one employment entry is required'});
    }

    for (const entry of employment) {
        if (!entry.companyName || !entry.jobTitle || !entry.startDate) {
            return res.status(400).json({message: 'companyName, jobTitle and startDate are required for each entry'});
        }
        if (!entry.isCurrent && !entry.endDate) {
            return res.status(400).json({message: 'endDate is required when isCurrent is false'});
        }
    }

    try {
        const data = employment.map(e => ({
            ...e,
            userId,
            endDate: e.isCurrent ? null : e.endDate,
            createdBy: userId,
            updatedBy: userId,
        }));

        await models.employmentHistory.bulkCreate(data);

        logger.info(logVar + 'Employment created for userId: ' + userId);
        return res.status(201).json({message: 'Employment history created successfully'});

    } catch (error) {
        logger.error(logVar + 'Error creating employment: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

async function updateEmployment(req, res) {
    logger.info(logVar + 'In updateEmployment');

    const userId = req.user?.userId;
    const {employment = []} = req.body;

    if (employment.length === 0) {
        return res.status(400).json({message: 'At least one employment entry is required'});
    }

    for (const entry of employment) {
        if (!entry.companyName || !entry.jobTitle || !entry.startDate) {
            return res.status(400).json({message: 'companyName, jobTitle and startDate are required for each entry'});
        }
        if (!entry.isCurrent && !entry.endDate) {
            return res.status(400).json({message: 'endDate is required when isCurrent is false'});
        }
    }

    try {
        for (const entry of employment) {
            if (entry.uuid) {
                await models.employmentHistory.update(
                    {
                        ...entry,
                        endDate: entry.isCurrent ? null : entry.endDate,
                        updatedBy: userId,
                    },
                    {where: {uuid: entry.uuid, userId}}
                );
            } else {
                await models.employmentHistory.create({
                    ...entry,
                    userId,
                    endDate: entry.isCurrent ? null : entry.endDate,
                    createdBy: userId,
                    updatedBy: userId,
                });
            }
        }

        logger.info(logVar + 'Employment updated for userId: ' + userId);
        return res.status(200).json({message: 'Employment history updated successfully'});

    } catch (error) {
        logger.error(logVar + 'Error updating employment: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

async function getEmployment(req, res) {
    logger.info(logVar + 'In getEmployment');

    const userId = req.user?.userId;

    try {
        const employment = await models.employmentHistory.findAll({where: {userId}});
        logger.info(logVar + 'Employment retrieved for userId: ' + userId);
        return res.status(200).json({data: employment});

    } catch (error) {
        logger.error(logVar + 'Error getting employment: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

async function uploadProfileImage(req, res) {
    logger.info(logVar + 'In uploadProfileImage');

    const userId = req.user?.userId;
    const file = req.file;

    if (!file) {
        logger.warn(logVar + 'No file provided in request');
        return res.status(400).json({message: 'No image file provided'});
    }

    try {
        await models.profileImages.update(
            {isDeleted: true, updatedBy: userId},
            {where: {userId, isDeleted: false}}
        );

        const publicId = `user_${userId}_${Date.now()}`;
        const result = await uploadToCloudinary(
            file.buffer,
            'alumni-platform/profile-images',
            publicId
        );

        const profileImage = await models.profileImages.create({
            userId,
            imageUrl: result.secure_url,
            imageId: result.public_id,
            createdBy: userId,
            updatedBy: userId,
        });

        await models.userDetails.update(
            {profileImageId: profileImage.id, updatedBy: userId},
            {where: {userId}}
        );

        logger.info(logVar + 'Profile image uploaded for userId: ' + userId);
        return res.status(201).json({
            message: 'Profile image uploaded successfully',
            data: {
                imageUrl: result.secure_url,
                imageId: result.public_id,
            }
        });

    } catch (error) {
        logger.error(logVar + 'Error uploading profile image: ' + error.message);
        return res.status(400).json({message: error.message});
    }
}

async function getProfileImage(req, res) {
    logger.info(logVar + 'In getProfileImage');

    const userId = req.user?.userId;

    try {
        const image = await models.profileImages.findOne({
            where: {userId, isDeleted: false}
        });

        if (!image) {
            return res.status(404).json({message: 'No profile image found'});
        }

        logger.info(logVar + 'Profile image retrieved for userId: ' + userId);
        return res.status(200).json({data: image});

    } catch (error) {
        logger.error(logVar + 'Error getting profile image: ' + error.message);
        return res.status(404).json({message: error.message});
    }
}

module.exports = {
    createPersonalInfo,
    updatePersonalInfo,
    getPersonalInfo,
    createQualifications,
    updateQualifications,
    getQualifications,
    createEmployment,
    updateEmployment,
    getEmployment,
    uploadProfileImage,
    getProfileImage,
};
