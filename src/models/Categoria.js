const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Categoria = sequelize.define(
  'Categoria',
  {
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
      validate: { len: { args: [2, 60], msg: 'El nombre de la categoria debe tener entre 2 y 60 caracteres' } },
    },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: 'categorias' }
);

module.exports = Categoria;
