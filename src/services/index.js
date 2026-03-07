const repositories = require('../repositories');

const buildCreateUserService = require('./users/createUser.service');
const buildHashPasswordService = require('./utilities/hashPassword.service');
const buildUserLoginService = require('./users/userLogin.service');

//user services
module.exports.createUser = buildCreateUserService(repositories.usersRepository, repositories.userRolesRepository);
module.exports.userLogin = buildUserLoginService(repositories.usersRepository, repositories.userRolesRepository);

//utilities services
module.exports.hashPassword = buildHashPasswordService();
