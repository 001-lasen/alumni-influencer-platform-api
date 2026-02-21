const services = require('../services');

const buildCreateUserController = require('./users/createUserController');
const buildHashPasswordController = require('./utilities/hashPasswordController');
const buildUserLoginController = require('./users/userLoginController');

//user controllers
module.exports.createUser = buildCreateUserController(services.createUser);
module.exports.userLogin = buildUserLoginController(services.userLogin);

//utilities controllers
module.exports.hashPassword = buildHashPasswordController(services.hashPassword);
