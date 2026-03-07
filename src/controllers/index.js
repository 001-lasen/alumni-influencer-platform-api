const services = require('../services');

const buildCreateUserController = require('./users/createUser.controller');
const buildHashPasswordController = require('./utilities/hashPassword.controller');
const buildUserLoginController = require('./users/userLogin.controller');

//user controllers
module.exports.createUser = buildCreateUserController(services.createUser);
module.exports.userLogin = buildUserLoginController(services.userLogin);

//utilities controllers
module.exports.hashPassword = buildHashPasswordController(services.hashPassword);
