const db = require('../models/index')

const buildUsersRepository = require('./users.repo')
const buildUserRolesRepository = require('./userRoles.repo');
const buildRefreshTokenRepository = require('./refreshToken.repo');
const buildTokenBlacklistRepository = require('./tokenBlacklist.repo');
const buildUserDetailsRepository = require('./userDetails.repo');

module.exports.usersRepository = buildUsersRepository(db);
module.exports.userRolesRepository = buildUserRolesRepository(db);
module.exports.refreshTokenRepository = buildRefreshTokenRepository(db);
module.exports.tokenBlacklistRepository = buildTokenBlacklistRepository(db);
module.exports.userDetailsRepository = buildUserDetailsRepository(db);
