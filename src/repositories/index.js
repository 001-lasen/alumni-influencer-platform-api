const db = require('../models/index')

const buildUsersRepository = require('./users.repo')
const buildUserRolesRepository = require('./userRoles.repo');

//user repositories
module.exports.usersRepository = buildUsersRepository(db);
module.exports.userRolesRepository = buildUserRolesRepository(db);
