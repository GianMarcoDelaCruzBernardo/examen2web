const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Medicamento = require('./Medicamento');
const Laboratorio = require('./Laboratorio');
const TipoMedic = require('./TipoMedic');
const Especialidad = require('./Especialidad');

Categoria.hasMany(Medicamento, { foreignKey: 'categoriaId', as: 'categoria' });
Medicamento.belongsTo(Categoria, { foreignKey: 'categoriaId' });

Laboratorio.hasMany(Medicamento, { foreignKey: 'laboratorioId', as: 'laboratorio' });
Medicamento.belongsTo(Laboratorio, { foreignKey: 'laboratorioId' });

TipoMedic.hasMany(Medicamento, { foreignKey: 'tipoMedicId', as: 'tipo' });
Medicamento.belongsTo(TipoMedic, { foreignKey: 'tipoMedicId' });

Especialidad.hasMany(Medicamento, { foreignKey: 'especialidadId', as: 'especialidad' });
Medicamento.belongsTo(Especialidad, { foreignKey: 'especialidadId' });

module.exports = { sequelize, Usuario, Categoria, Medicamento, Laboratorio, TipoMedic, Especialidad };
