const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const UserDetails = sequelize.define('UserDetails', {
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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    linkedInProfile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profileImageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    biography: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'user_details',
    timestamps: true,
    indexes: [
        { unique: true, fields: ['uuid'] },
        { unique: true, fields: ['userName'] },
        { unique: true, fields: ['email'] },
    ]
});

module.exports = UserDetails;
