const services = require('../services');

const buildCreateUserController = require('./users/createUser.controller');
const buildHashPasswordController = require('./utilities/hashPassword.controller');
const buildUserLoginController = require('./users/userLogin.controller');
const buildResendOTPController = require('./users/resendOTP.controller');

//user controllers
module.exports.createUser = buildCreateUserController(services.createUser);
module.exports.userLogin = buildUserLoginController(services.userLogin);
module.exports.resendOTP = buildResendOTPController(services.verifyEmail);

//utilities controllers
module.exports.hashPassword = buildHashPasswordController(services.hashPassword);
