const repositories = require('../repositories');

const buildCreateUserService = require('./users/createUser.service');
const buildHashPasswordService = require('./utilities/hashPassword.service');
const buildUserLoginService = require('./users/userLogin.service');
const buildVerifyEmailService = require('./users/verifyEmail.service');

// user services
const verifyEmail = buildVerifyEmailService(repositories.usersRepository);
const createUser = buildCreateUserService(verifyEmail, repositories.usersRepository, repositories.userRolesRepository);
const userLogin = buildUserLoginService(verifyEmail, repositories.usersRepository, repositories.userRolesRepository);

// utility services
const hashPassword = buildHashPasswordService();

module.exports = {
    createUser,
    verifyEmail,
    userLogin,
    hashPassword
};
