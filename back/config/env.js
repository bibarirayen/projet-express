// config/env.js
const env = {
  database: 'express_projet',
  username: 'root',
  password: '',
  host: 'localhost',
  dialect: 'mysql', // ✅ Ceci est obligatoire
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

module.exports = env;
