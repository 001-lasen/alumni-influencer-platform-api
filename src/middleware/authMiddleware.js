const jwtUtil = require('../utils/jwtUtil');
const logger = require('../utils/logger');
const logVar = 'Middleware | authMiddleware | ';
const models = require('../models');

module.exports = function authMiddleware(requiredRole = null) {
    return async function (req, res, next) {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn(logVar + 'Missing or malformed Authorization header');
            return res.status(401).json({message: 'Unauthorized'});
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwtUtil.verifyAccessToken(token);

            const blacklisted = await models.tokenBlacklist.findOne({where: {token}});
            if (blacklisted) {
                logger.warn(logVar + 'Token is blacklisted');
                return res.status(401).json({message: 'Unauthorized'});
            }

            req.user = decoded;
            logger.info(logVar + 'Token verified for userId: ' + decoded.userId);

            if (requiredRole) {
                const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
                if (!req.user.roles?.some(role => requiredRoles.includes(role))) {
                    logger.warn(logVar + 'Insufficient role for userId: ' + decoded.userId);
                    return res.status(403).json({message: 'Forbidden'});
                }
            }

            next();
        } catch (error) {
            logger.warn(logVar + 'Invalid or expired access token: ' + error.message);
            return res.status(401).json({message: 'Unauthorized'});
        }
    };
};
