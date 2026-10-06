const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medicamento = sequelize.define(
  'Medicamento',
  {
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { len: { args: [2, 100], msg: 'El nombre del medicamento debe tener entre 2 y 100 caracteres' } },
    },
    laboratorio: { type: DataTypes.STRING(100), allowNull: true },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: 'El precio no puede ser negativo' } },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: { args: [0], msg: 'El stock no puede ser negativo' } },
    },
    fecha_vencimiento: { type: DataTypes.DATEONLY, allowNull: true },
  },
  { tableName: 'medicamentos' }
);

module.exports = Medicamento;
