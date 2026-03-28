const logger = require('../../utils/logger');
const logVar = 'Services | profileImageService | ';
const {uploadToCloudinary} = require('../../config/cloudinary');

module.exports = function buildProfileImageService(userDetailsRepository) {
    return Object.freeze({
        uploadProfileImage,
        getProfileImage,
    });

    async function uploadProfileImage(userId, file) {
        logger.info(logVar + 'In uploadProfileImage service for userId: ' + userId);

        if (!file) {
            throw new Error('No image file provided');
        }

        await userDetailsRepository.softDeleteProfileImage(userId);

        const publicId = `user_${userId}_${Date.now()}`;

        const result = await uploadToCloudinary(file.buffer, 'alumni-platform/profile-images', publicId);

        const profileImage = await userDetailsRepository.createProfileImage({
            userId,
            imageUrl: result.secure_url,
            imageId: result.public_id,
            createdBy: userId,
            updatedBy: userId,
        });

        await userDetailsRepository.updateUserDetails(userId, {
            profileImageId: profileImage.id,
            updatedBy: userId,
        });

        logger.info(logVar + 'Profile image uploaded for userId: ' + userId);
        return {
            statusCode: 201,
            message: 'Profile image uploaded successfully',
            data: {
                imageUrl: result.secure_url,
                imageId: result.public_id,
            }
        };
    }

    async function getProfileImage(userId) {
        logger.info(logVar + 'In getProfileImage service for userId: ' + userId);

        const image = await userDetailsRepository.findActiveProfileImage(userId);
        if (!image) {
            throw new Error('No profile image found');
        }

        return {statusCode: 200, data: image};
    }
}
