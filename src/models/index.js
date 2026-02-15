const sequelize = require('../config/sequelize');

const users = require('./users');

const db = {
    sequelize,
    users,
};

module.exports = db;
