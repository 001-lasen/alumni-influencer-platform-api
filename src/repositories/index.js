const db = require('../models/index')

const buildUsersRepository = require('./users.repo')
const buildUserRolesRepository = require('./userRolesRepository');

//user repositories
module.exports.usersRepository = buildUsersRepository(db);
module.exports.userRolesRepository = buildUserRolesRepository(db);
