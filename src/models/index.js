const sequelize = require('../config/sequelize');

const users = require('./users');
const userRoleUserMapping = require('./userRoleUserMapping');
const userDetails = require('./userDetails');
const profileImages = require('./profileImages');

const db = {
    sequelize,
    users,
    userRoles,
    userRoleUserMapping,
    userDetails,
    profileImages,
};

db.users.hasOne(db.userDetails, { foreignKey: 'userId', as : 'details' });
db.userDetails.belongsTo(db.users, { foreignKey: 'userId' });

db.users.hasMany(db.profileImages, { foreignKey: 'userId', as: 'profileImages' });
db.profileImages.belongsTo(db.users, { foreignKey: 'userId' });

db.userRoles.belongsToMany(db.users, { through: db.userRoleUserMapping, foreignKey: 'roleId', as: 'users' });
db.users.belongsToMany(db.userRoles, { through: db.userRoleUserMapping, foreignKey: 'userId', as: 'roles' });

module.exports = db;
