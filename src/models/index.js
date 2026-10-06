const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Medicamento = require('./Medicamento');
const Laboratorio = require('./Laboratorio');
const TipoMedic = require('./TipoMedic');
const Especialidad = require('./Especialidad');

// Categoria 1:N Medicamento
Categoria.hasMany(Medicamento, { foreignKey: 'categoriaId', as: 'medicamentos' });
Medicamento.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });

// Laboratorio 1:N Medicamento
Laboratorio.hasMany(Medicamento, { foreignKey: 'laboratorioId', as: 'medicamentos' });
Medicamento.belongsTo(Laboratorio, { foreignKey: 'laboratorioId', as: 'laboratorio' });

// TipoMedic 1:N Medicamento
TipoMedic.hasMany(Medicamento, { foreignKey: 'tipoMedicId', as: 'medicamentos' });
Medicamento.belongsTo(TipoMedic, { foreignKey: 'tipoMedicId', as: 'tipo' });

// Especialidad 1:N Medicamento
Especialidad.hasMany(Medicamento, { foreignKey: 'especialidadId', as: 'medicamentos' });
Medicamento.belongsTo(Especialidad, { foreignKey: 'especialidadId', as: 'especialidad' });

module.exports = { sequelize, Usuario, Categoria, Medicamento, Laboratorio, TipoMedic, Especialidad };