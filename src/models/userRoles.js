const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const userRoles = sequelize.define('userRoles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
    },
    roleName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    updatedBy: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},{
    tableName: 'user_roles',
    timestamps: true
});

module.exports = userRoles;
