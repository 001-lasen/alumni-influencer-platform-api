const repositories = require('../repositories');

const buildCreateUserService = require('./users/createUserService');
const buildHashPasswordService = require('./utilities/hashPasswordService');
const buildUserLoginService = require('./users/userLoginService');

//user services
module.exports.createUser = buildCreateUserService(repositories.usersRepository, repositories.userRolesRepository);
module.exports.userLogin = buildUserLoginService(repositories.usersRepository, repositories.userRolesRepository);

//utilities services
module.exports.hashPassword = buildHashPasswordService();
