const sequelize = require('../config/sequelize');

const users = require('./users');
const userRoles = require('./userRoles');

const db = {
    sequelize,
    users,
    userRoles
};

module.exports = db;
