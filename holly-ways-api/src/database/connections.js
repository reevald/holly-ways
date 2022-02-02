const Sequelize = require("sequelize");

const db = {};

// Setting
const sequelize = new Sequelize("hollyways-db", {
  dialect: "mysql",
  username: "root",
  password: null,
  host: "localhost",
  logging: console.log,
  freezeTableName: true, // Model tableName will be the same as the model name
  pool: { // default
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

db.sequelize = sequelize;

module.exports = db;
