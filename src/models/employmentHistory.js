const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const EmploymentHistory = sequelize.define('EmploymentHistory', {
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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sector: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    isCurrent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    tableName: 'employment_history',
    timestamps: true,
    indexes: [{
        unique: true,
        fields: ['uuid']
    }]
});

module.exports = EmploymentHistory;
