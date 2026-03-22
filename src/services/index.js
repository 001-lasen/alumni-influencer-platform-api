const repositories = require('../repositories');

const buildCreateUserService = require('./users/createUser.service');
const buildHashDataService = require('./utilities/hashPassword.service');
const buildUserLoginService = require('./users/userLogin.service');
const buildVerifyEmailService = require('./users/verifyEmail.service');
const buildRefreshService = require('./users/refresh.service');
const buildUserLogoutService = require('./users/userLogout.service');
const buildChangePasswordService = require('./users/changePassword.service');
const buildForgotPasswordService = require('./users/forgotPassword.service');

// user services
const verifyEmail = buildVerifyEmailService(repositories.usersRepository);
const createUser = buildCreateUserService(verifyEmail, repositories.usersRepository, repositories.userRolesRepository);
const userLogin = buildUserLoginService(repositories.usersRepository, repositories.userRolesRepository, repositories.refreshTokenRepository);
const refreshService = buildRefreshService(repositories.refreshTokenRepository, repositories.userRolesRepository);
const userLogout = buildUserLogoutService(repositories.refreshTokenRepository, repositories.tokenBlacklistRepository);
const changePassword = buildChangePasswordService(repositories.usersRepository, repositories.refreshTokenRepository);
const forgotPassword = buildForgotPasswordService(repositories.usersRepository, repositories.refreshTokenRepository);

// utility services
const hashData = buildHashDataService();

module.exports = {
    createUser,
    verifyEmail,
    userLogin,
    hashData,
    refreshService,
    userLogout,
    changePassword,
    forgotPassword
};
