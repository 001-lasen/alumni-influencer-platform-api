const repositories = require('../repositories');

const buildCreateUserService = require('./users/createUserService');

//user services
module.exports.createUser = buildCreateUserService(repositories.usersRepository);
