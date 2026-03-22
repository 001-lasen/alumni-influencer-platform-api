const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const TokenBlacklist = sequelize.define('TokenBlacklist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: 'token_blacklist',
    timestamps: true,
});

module.exports = TokenBlacklist;
