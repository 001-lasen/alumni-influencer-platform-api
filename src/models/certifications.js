const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const Certifications = sequelize.define('Certifications', {
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
    certificationName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issuingBody: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    certificationUrl: {
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
    tableName: 'certifications',
    timestamps: true,
    indexes: [{
        unique: true,
        fields: ['uuid']
    }]
});

module.exports = Certifications;
