const logger = require('../utils/logger');
const logVar = 'Repositories | userRoles.repo | ';

module.exports = function buildUserRolesRepository(models) {
    return Object.freeze({
        assignRoleToAlumniUser,
        getUserRoles
    });

    async function assignRoleToAlumniUser(userId, role) {
        logger.info(logVar + 'In assignRoleToUser repository');

        // try {
        //     const userRole = await models.userRoles.findAll({
        //         where
        //     })
        // }
    }

    async function getUserRoles(userId) {
        logger.info(logVar + 'In getUserRoles repository');
    }
}
