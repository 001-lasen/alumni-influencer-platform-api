const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    userType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otpExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    otpAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    otpVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'users',
    timestamps: true,
    indexes: [
        { unique: true, fields: ['uuid']},
        { unique: true, fields: ['email'] },
    ]
});

module.exports = Users;
