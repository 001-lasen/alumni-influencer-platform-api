const logger = require('../utils/logger');
const logVar = 'Repositories | userRoles.repo | ';

module.exports = function buildUserRolesRepository(models) {
    return Object.freeze({
        assignRoleToUser,
        getUserRoles
    });

    async function assignRoleToUser(userId, userType) {
        logger.info(logVar + 'In assignRoleToUser repository');

        try {
            const userRoles = await models.userRoles.findAll({
                where: { roleType: userType }
            });

            if (!userRoles || userRoles.length === 0) {
                logger.warn(logVar + `No roles found for type: ${userType}`);
                throw new Error(`Assignment failed: Role type ${userType} does not exist.`);
            }

            const roleMappings = userRoles.map((role) => {
                return {
                    userId: userId,
                    roleId: role.id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
            });

            await models.userRoleUserMapping.bulkCreate(roleMappings);
            logger.info(logVar + `Successfully assigned ${userType} role to user with ID: ${userId}`);
        } catch (error) {
            logger.error(logVar + 'Error assigning role to user: ' + error.message);
            throw error;
        }
    }

    async function getUserRoles(userId) {
        logger.info(logVar + 'In getUserRoles repository');
    }
}
