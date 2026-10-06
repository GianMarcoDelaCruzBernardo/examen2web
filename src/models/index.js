const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Medicamento = require('./Medicamento');

// Relacion 1:N -> Una categoria tiene muchos medicamentos
Categoria.hasMany(Medicamento, {
  foreignKey: { name: 'categoriaId', allowNull: false },
  as: 'medicamentos',
  onDelete: 'RESTRICT',
});
Medicamento.belongsTo(Categoria, {
  foreignKey: { name: 'categoriaId', allowNull: false },
  as: 'categoria',
});

module.exports = { sequelize, Usuario, Categoria, Medicamento };
