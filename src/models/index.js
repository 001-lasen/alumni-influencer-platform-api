const sequelize = require('../config/sequelize');

const users = require('./users');
const userRoles = require('./userRoles');
const userRoleUserMapping = require('./userRoleUserMapping');
const userDetails = require('./userDetails');
const profileImages = require('./profileImages');
const refreshTokens = require('./refreshToken');
const tokenBlacklist = require('./tokenBlacklist');

const db = {
    sequelize,
    users,
    userRoles,
    userRoleUserMapping,
    userDetails,
    profileImages,
    refreshTokens,
    tokenBlacklist
};

db.users.hasOne(db.userDetails, { foreignKey: 'userId', as : 'details' });
db.userDetails.belongsTo(db.users, { foreignKey: 'userId' });

db.users.hasMany(db.profileImages, { foreignKey: 'userId', as: 'profileImages' });
db.profileImages.belongsTo(db.users, { foreignKey: 'userId' });

db.userRoles.belongsToMany(db.users, { through: db.userRoleUserMapping, foreignKey: 'roleId', as: 'users' });
db.users.belongsToMany(db.userRoles, { through: db.userRoleUserMapping, foreignKey: 'userId', as: 'roles' });

db.users.hasMany(db.refreshTokens, { foreignKey: 'userId', as: 'refreshTokens' });
db.refreshTokens.belongsTo(db.users, { foreignKey: 'userId' });

module.exports = db;
