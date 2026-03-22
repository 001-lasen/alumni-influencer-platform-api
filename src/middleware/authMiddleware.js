const jwtUtil = require('../utils/jwtUtil');
const logger = require('../utils/logger');
const logVar = ' Middleware | authMiddleware | ';
const repositories = require('../repositories/index');
const tokenBlacklistRepository = repositories.tokenBlacklistRepository;

module.exports = async function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.warn(logVar + 'Missing or malformed Authorization header');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwtUtil.verifyAccessToken(token);

        const blacklisted = await tokenBlacklistRepository.isTokenBlacklisted(token);
        if (blacklisted) {
            logger.warn(logVar + 'Token is blacklisted');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = decoded;
        logger.info(logVar + 'Token verified for userId: ' + decoded.userId);
        next();
    } catch (error) {
        logger.warn(logVar + 'Invalid or expired access token: ' + error.message);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
