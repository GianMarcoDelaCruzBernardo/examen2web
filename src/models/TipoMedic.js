const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TipoMedic = sequelize.define('TipoMedic', {
  CodTipoMed: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descripcion: { type: DataTypes.STRING(100), allowNull: false }
}, { tableName: 'tipo_medicamentos' });
module.exports = TipoMedic;
