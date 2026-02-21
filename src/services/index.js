const repositories = require('../repositories');

const buildCreateUserService = require('./users/createUserService');
const buildHashPasswordService = require('./utilities/hashPasswordService');

//user services
module.exports.createUser = buildCreateUserService(repositories.usersRepository);

//utilities services
module.exports.hashPassword = buildHashPasswordService();
