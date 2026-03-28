const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const envConstants = require('../utils/constants');
const logger = require('../utils/logger');
const logVar = 'Config | cloudinary | ';

cloudinary.config({
    cloud_name: envConstants.CLOUDINARY_CLOUD_NAME,
    api_key: envConstants.CLOUDINARY_API_KEY,
    api_secret: envConstants.CLOUDINARY_API_SECRET
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only jpg, png and webp images are allowed'));
        }
    }
});

async function uploadToCloudinary(fileBuffer, folder, publicId) {
    logger.info(logVar + 'Uploading image to Cloudinary');
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: publicId,
                transformation: [{width: 500, height: 500, crop: 'limit'}],
            },
            (error, result) => {
                if (error) {
                    logger.error(logVar + 'Cloudinary upload error: ' + error.message);
                    reject(error);
                } else {
                    logger.info(logVar + 'Image uploaded successfully');
                    resolve(result);
                }
            }
        ).end(fileBuffer);
    });
}

module.exports = {upload, uploadToCloudinary};
