const services = require('../services');

const buildCreateUserController = require('./users/createUser.controller');
const buildHashDataController = require('./utilities/hashData.controller');
const buildUserLoginController = require('./users/userLogin.controller');
const buildResendOTPController = require('./users/resendOTP.controller');
const buildVerifyUserEmailController = require('./users/verifyUserEmail.controller');
const buildRefreshController = require('./users/refresh.controller');
const buildUserLogoutController = require('./users/userLogout.controller');
const buildChangePasswordController = require('./users/changePassword.controller');
const buildForgotPasswordController = require('./users/forgotPassword.controller');
const buildVerifyForgotPasswordOTPController = require('./users/verifyForgotPasswordOTP.controller');
const buildResetPasswordController = require('./users/resetPassword.controller');
const buildPersonalInfoController = require('./profile/personalInfomation.controller');
const buildUserQualificationsController = require('./profile/userQualifications.controller');
const buildUserEmploymentController = require('./profile/userEmployment.controller');
const buildProfileImageController = require('./profile/profileImage.controller');

const personalInfoController = buildPersonalInfoController(services.personalInfo);
const userQualificationsController = buildUserQualificationsController(services.qualifications);
const userEmploymentController = buildUserEmploymentController(services.employmentService);
const profileImageController = buildProfileImageController(services.profileImageService);

//user controllers
module.exports.createUser = buildCreateUserController(services.createUser);
module.exports.userLogin = buildUserLoginController(services.userLogin);
module.exports.resendOTP = buildResendOTPController(services.verifyEmail);
module.exports.verifyUserEmail = buildVerifyUserEmailController(services.verifyEmail);
module.exports.refreshToken = buildRefreshController(services.refreshService);
module.exports.userLogout = buildUserLogoutController(services.userLogout);
module.exports.changePassword = buildChangePasswordController(services.changePassword);
module.exports.forgotPassword = buildForgotPasswordController(services.forgotPassword);
module.exports.verifyForgotPasswordOTP = buildVerifyForgotPasswordOTPController(services.forgotPassword);
module.exports.resetPassword = buildResetPasswordController(services.forgotPassword);

//profile controllers
module.exports.createPersonalInfo = personalInfoController.createPersonalInfo;
module.exports.updatePersonalInfo = personalInfoController.updatePersonalInfo;
module.exports.getPersonalInfo = personalInfoController.getPersonalInfo;
module.exports.createQualifications = userQualificationsController.createQualifications;
module.exports.updateQualifications = userQualificationsController.updateQualifications;
module.exports.getQualifications = userQualificationsController.getQualifications;
module.exports.createEmployment = userEmploymentController.createEmployment;
module.exports.updateEmployment = userEmploymentController.updateEmployment;
module.exports.getEmployment = userEmploymentController.getEmployment;
module.exports.uploadProfileImage = profileImageController.uploadProfileImage;
module.exports.getProfileImage = profileImageController.getProfileImage;

//utilities controllers
module.exports.hashData = buildHashDataController(services.hashData);
