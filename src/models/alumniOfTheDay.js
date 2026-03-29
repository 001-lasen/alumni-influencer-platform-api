const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const AlumniOfTheDay = sequelize.define('AlumniOfTheDay', {
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
    bidId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    slotDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'alumni_of_the_day',
    timestamps: true,
    indexes: [
        {unique: true, fields: ['uuid']},
        {unique: true, fields: ['slotDate']},
    ]
});

module.exports = AlumniOfTheDay;
