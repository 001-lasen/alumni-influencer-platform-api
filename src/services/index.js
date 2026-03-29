const repositories = require('../repositories');

const buildCreateUserService = require('./users/createUser.service');
const buildHashDataService = require('./utilities/hashPassword.service');
const buildUserLoginService = require('./users/userLogin.service');
const buildVerifyEmailService = require('./users/verifyEmail.service');
const buildRefreshService = require('./users/refresh.service');
const buildUserLogoutService = require('./users/userLogout.service');
const buildChangePasswordService = require('./users/changePassword.service');
const buildForgotPasswordService = require('./users/forgotPassword.service');
const buildPersonalInfoService = require('./profile/personalInformation.service');
const buildUserQualificationsService = require('./profile/userQualifications.service');
const buildUserEmploymentService = require('./profile/userEmployment.service');
const buildProfileImageService = require('./profile/profileImage.service');
const buildBiddingService = require('./bidding/bidding.service');

// user services
const verifyEmail = buildVerifyEmailService(repositories.usersRepository);
const createUser = buildCreateUserService(repositories.usersRepository, repositories.userRolesRepository);
const userLogin = buildUserLoginService(repositories.usersRepository, repositories.userRolesRepository, repositories.refreshTokenRepository);
const refreshService = buildRefreshService(repositories.refreshTokenRepository, repositories.userRolesRepository);
const userLogout = buildUserLogoutService(repositories.refreshTokenRepository, repositories.tokenBlacklistRepository);
const changePassword = buildChangePasswordService(repositories.usersRepository, repositories.refreshTokenRepository);
const forgotPassword = buildForgotPasswordService(repositories.usersRepository, repositories.refreshTokenRepository);

// utility services
const hashData = buildHashDataService();

// profile services
const personalInfo = buildPersonalInfoService(repositories.userDetailsRepository);
const qualifications = buildUserQualificationsService(repositories.userDetailsRepository);
const employmentService = buildUserEmploymentService(repositories.userDetailsRepository);
const profileImageService = buildProfileImageService(repositories.userDetailsRepository);

//bidding services
const biddingService = buildBiddingService(repositories.biddingRepository);

module.exports = {
    createUser,
    verifyEmail,
    userLogin,
    hashData,
    refreshService,
    userLogout,
    changePassword,
    forgotPassword,
    personalInfo,
    qualifications,
    employmentService,
    profileImageService,
    biddingService,
};
