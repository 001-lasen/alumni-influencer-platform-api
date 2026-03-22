const services = require('../services');

const buildCreateUserController = require('./users/createUser.controller');
const buildHashDataController = require('./utilities/hashData.controller');
const buildUserLoginController = require('./users/userLogin.controller');
const buildResendOTPController = require('./users/resendOTP.controller');
const buildVerifyUserEmailController = require('./users/verifyUserEmail.controller');
const buildRefreshController = require('./users/refresh.controller');
const buildUserLogoutController = require('./users/userLogout.controller');
const buildChangePasswordController = require('./users/changePassword.controller');

//user controllers
module.exports.createUser = buildCreateUserController(services.createUser);
module.exports.userLogin = buildUserLoginController(services.userLogin);
module.exports.resendOTP = buildResendOTPController(services.verifyEmail);
module.exports.verifyUserEmail = buildVerifyUserEmailController(services.verifyEmail);
module.exports.refreshToken = buildRefreshController(services.refreshService);
module.exports.userLogout = buildUserLogoutController(services.userLogout);
module.exports.changePassword = buildChangePasswordController(services.changePassword);

//utilities controllers
module.exports.hashData = buildHashDataController(services.hashData);
