const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const userRoleUserMapping = sequelize.define('userRoleUserMapping', {
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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: 'user_role_user_mapping',
    timestamps: true
});

module.exports = userRoleUserMapping;
