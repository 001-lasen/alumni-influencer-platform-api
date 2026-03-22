const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const ProfessionalCourses = sequelize.define('ProfessionalCourses', {
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
    courseName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    courseUrl: {
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
    tableName: 'professional_courses',
    timestamps: true,
    indexes: [{
        unique: true,
        fields: ['uuid']
    }]
});

module.exports = ProfessionalCourses;
