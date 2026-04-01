const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const UserRoles = sequelize.define('UserRoles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    roleName: {
        type: DataTypes.STRING,
        allowNull: false,
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
    timestamps: true,
    indexes: [
        { unique: true, fields: ['uuid'] },
        { unique: true, fields: ['roleName'] },
    ]
});

module.exports = UserRoles;
