const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const Licences = sequelize.define('Licences', {
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
    licenceName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    awardingBody: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    licenceUrl: {
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
    tableName: 'licences',
    timestamps: true,
    indexes: [{
        unique: true,
        fields: ['uuid']
    }]
});

module.exports = Licences;
