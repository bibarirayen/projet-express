const Sequelize = require('sequelize');
const env = require('../config/env.js');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  pool: env.pool,
  logging: false
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require('./users.js')(sequelize, Sequelize);
db.Project = require('./projects.js')(sequelize, Sequelize);
db.Task = require('./tasks.js')(sequelize, Sequelize);
db.ProjectMember = require('./project_members.js')(sequelize, Sequelize);
db.User.hasMany(db.Project, { foreignKey: 'created_by', as: 'createdProjects' });
db.Project.belongsTo(db.User, { foreignKey: 'created_by', as: 'owner' });
db.User.belongsToMany(db.Project, {
  through: db.ProjectMember,
  foreignKey: 'user_id',
  otherKey: 'project_id',
  as: 'joinedProjects'
});
db.Project.belongsToMany(db.User, {
  through: db.ProjectMember,
  foreignKey: 'project_id',
  otherKey: 'user_id',
  as: 'members'
});
db.Project.hasMany(db.Task, { foreignKey: 'project_id', as: 'tasks' });
db.Task.belongsTo(db.Project, { foreignKey: 'project_id', as: 'project' });
db.User.hasMany(db.Task, { foreignKey: 'assigned_to', as: 'assignedTasks' });
db.Task.belongsTo(db.User, { foreignKey: 'assigned_to', as: 'assignee' });
db.User.hasMany(db.Task, { foreignKey: 'created_by', as: 'createdTasks' });
db.Task.belongsTo(db.User, { foreignKey: 'created_by', as: 'creator' });
db.User.hasMany(db.ProjectMember, { foreignKey: 'created_by', as: 'addedMembers' });
db.ProjectMember.belongsTo(db.User, { foreignKey: 'created_by', as: 'addedBy' });
db.ProjectMember.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
module.exports = db;
