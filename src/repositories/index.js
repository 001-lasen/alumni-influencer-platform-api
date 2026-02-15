const db = require('../models/index')

const buildUsersRepository = require('./users.repo')

module.exports.usersRepository = buildUsersRepository(db);
