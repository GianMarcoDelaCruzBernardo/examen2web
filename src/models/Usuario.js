const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define(
  'Usuario',
  {
    nombre: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: { len: { args: [3, 80], msg: 'El nombre debe tener entre 3 y 80 caracteres' } },
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: 'Correo electronico invalido' } },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    rol: {
      type: DataTypes.ENUM('administrador', 'moderador', 'usuario'),
      allowNull: false,
      defaultValue: 'usuario',
    },
  },
  { tableName: 'usuarios' }
);

module.exports = Usuario;
