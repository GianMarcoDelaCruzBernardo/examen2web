const path = require('path');
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // Produccion (Render): PostgreSQL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions:
      process.env.DB_SSL === 'false'
        ? {}
        : { ssl: { require: true, rejectUnauthorized: false } },
  });
} else {
  // Local: SQLite -> archivo bd_Farmacia.sqlite (no requiere instalar nada)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', '..', 'bd_Farmacia.sqlite'),
    logging: false,
  });
}

module.exports = sequelize;
