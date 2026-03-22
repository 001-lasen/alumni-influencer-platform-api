const db = require('../models/index')

const buildUsersRepository = require('./users.repo')
const buildUserRolesRepository = require('./userRoles.repo');
const buildRefreshTokenRepository = require('./refreshToken.repo');
const buildTokenBlacklistRepository = require('./tokenBlacklist.repo');

//user repositories
module.exports.usersRepository = buildUsersRepository(db);
module.exports.userRolesRepository = buildUserRolesRepository(db);
module.exports.refreshTokenRepository = buildRefreshTokenRepository(db);
module.exports.tokenBlacklistRepository = buildTokenBlacklistRepository(db);
