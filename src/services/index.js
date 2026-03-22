const repositories = require('../repositories');

const buildCreateUserService = require('./users/createUser.service');
const buildHashDataService = require('./utilities/hashPassword.service');
const buildUserLoginService = require('./users/userLogin.service');
const buildVerifyEmailService = require('./users/verifyEmail.service');

// user services
const verifyEmail = buildVerifyEmailService(repositories.usersRepository);
const createUser = buildCreateUserService(verifyEmail, repositories.usersRepository, repositories.userRolesRepository);
const userLogin = buildUserLoginService(repositories.usersRepository, repositories.userRolesRepository, repositories.refreshTokenRepository);

// utility services
const hashData = buildHashDataService();

module.exports = {
    createUser,
    verifyEmail,
    userLogin,
    hashData
};
