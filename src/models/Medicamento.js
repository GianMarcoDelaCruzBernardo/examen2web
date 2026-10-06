const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Medicamento = sequelize.define('Medicamento', {
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  fecha_vencimiento: { type: DataTypes.DATEONLY, allowNull: true }
}, { tableName: 'medicamentos' });
module.exports = Medicamento;
