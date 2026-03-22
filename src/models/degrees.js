const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const Degrees = sequelize.define('Degrees', {
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
    degreeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    institution: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    degreeUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    completionDate: {
        type: DataTypes.DATEONLY,
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
    tableName: 'degrees',
    timestamps: true,
    indexes: [{
        unique: true,
        fields: ['uuid']
    }]
});

module.exports = Degrees;
