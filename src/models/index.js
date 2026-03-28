const sequelize = require('../config/sequelize');

const users = require('./users');
const userRoles = require('./userRoles');
const userRoleUserMapping = require('./userRoleUserMapping');
const userDetails = require('./userDetails');
const profileImages = require('./profileImages');
const refreshTokens = require('./refreshToken');
const tokenBlacklist = require('./tokenBlacklist');
const degrees = require('./degrees');
const certifications = require('./certifications');
const licences = require('./licences');
const professionalCourses = require('./professionalCourses');
const employmentHistory = require('./employmentHistory');

const db = {
    sequelize,
    users,
    userRoles,
    userRoleUserMapping,
    userDetails,
    profileImages,
    refreshTokens,
    tokenBlacklist,
    degrees,
    certifications,
    licences,
    professionalCourses,
    employmentHistory
};

db.users.hasOne(db.userDetails, { foreignKey: 'userId', as : 'details' });
db.userDetails.belongsTo(db.users, { foreignKey: 'userId' });

db.users.hasMany(db.profileImages, { foreignKey: 'userId', as: 'profileImages' });
db.profileImages.belongsTo(db.users, { foreignKey: 'userId' });

db.userRoles.belongsToMany(db.users, { through: db.userRoleUserMapping, foreignKey: 'roleId', as: 'users' });
db.users.belongsToMany(db.userRoles, { through: db.userRoleUserMapping, foreignKey: 'userId', as: 'roles' });

db.users.hasMany(db.refreshTokens, { foreignKey: 'userId', as: 'refreshTokens' });
db.refreshTokens.belongsTo(db.users, { foreignKey: 'userId' });

db.users.hasMany(db.degrees, { foreignKey: 'userId', as: 'degrees' });
db.degrees.belongsTo(db.users, { foreignKey: 'userId' });

db.users.hasMany(db.certifications, { foreignKey: 'userId', as: 'certifications' });
db.certifications.belongsTo(db.users, { foreignKey: 'userId' });

db.users.hasMany(db.licences, { foreignKey: 'userId', as: 'licences' });
db.licences.belongsTo(db.users, { foreignKey: 'userId' });

db.users.hasMany(db.professionalCourses, { foreignKey: 'userId', as: 'professionalCourses' });
db.professionalCourses.belongsTo(db.users, { foreignKey: 'userId' });

db.users.hasMany(db.employmentHistory, { foreignKey: 'userId', as: 'employmentHistory' });
db.employmentHistory.belongsTo(db.users, { foreignKey: 'userId' });

module.exports = db;
