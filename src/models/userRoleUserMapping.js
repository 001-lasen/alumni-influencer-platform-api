const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const UserRoleUserMapping = sequelize.define('UserRoleUserMapping', {
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
    }
}, {
    tableName: 'user_role_user_mapping',
    timestamps: true
});

module.exports = UserRoleUserMapping;
