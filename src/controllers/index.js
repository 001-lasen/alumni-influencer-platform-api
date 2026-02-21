const services = require('../services');

const buildCreateUserController = require('./users/createUserController');
const buildHashPasswordController = require('./utilities/hashPasswordController');

//user controllers
module.exports.createUser = buildCreateUserController(services.createUser);

//utilities controllers
module.exports.hashPassword = buildHashPasswordController(services.hashPassword);
