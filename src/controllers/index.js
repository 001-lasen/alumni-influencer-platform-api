const services = require('../services');

const buildCreateUserController = require('./users/createUserController');

//user controllers
module.exports.createUser = buildCreateUserController(services.createUser);
