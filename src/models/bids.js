const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const Bids = sequelize.define('Bids', {
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
    bidAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    slotDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    isWinner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
    tableName: 'bids',
    timestamps: true,
    indexes: [{unique: true, fields: ['uuid']}]
});

module.exports = Bids;
