// config/db.config.js
const env = require('./env.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect, // 👈 obligatoire
  pool: {
    max: env.pool.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  },
  logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('../models/users.js')(sequelize, Sequelize);
db.Project = require('../models/projects.js')(sequelize, Sequelize);
db.Task = require('../models/tasks.js')(sequelize, Sequelize);
db.ProjectMember = require('../models/project_members.js')(sequelize, Sequelize);

module.exports = db;
