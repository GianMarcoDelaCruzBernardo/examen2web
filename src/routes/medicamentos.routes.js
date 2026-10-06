const express = require('express');
const { Categoria, Medicamento, Laboratorio, TipoMedic, Especialidad } = require('../models');
const { requireAuth, requireRole } = require('../middleware/auth');
const { wrap, mensajeError, pick } = require('../utils/helpers');

const router = express.Router();
const editar = requireRole('administrador', 'moderador');
const borrar = requireRole('administrador');
router.use(requireAuth);

const obtenerListas = async () => {
  const [categorias, laboratorios, tipos, especialidades] = await Promise.all([
    Categoria.findAll({ order: [['nombre', 'ASC']] }),
    Laboratorio.findAll({ order: [['razonSocial', 'ASC']] }),
    TipoMedic.findAll({ order: [['descripcion', 'ASC']] }),
    Especialidad.findAll({ order: [['descripcionEsp', 'ASC']] })
  ]);
  return { categorias, laboratorios, tipos, especialidades };
};

router.get('/', wrap(async (req, res) => {
  const medicamentos = await Medicamento.findAll({ 
    include: ['categoria', 'laboratorio', 'tipo', 'especialidad'],
    order: [['nombre', 'ASC']] 
  });
  res.render('medicamentos/index', { medicamentos });
}));

router.get('/nuevo', editar, wrap(async (req, res) => {
  res.render('medicamentos/form', { medicamento: null, listas: await obtenerListas() });
}));

router.post('/', editar, wrap(async (req, res) => {
  const d = pick(req.body, ['nombre', 'precio', 'stock', 'fecha_vencimiento', 'categoriaId', 'laboratorioId', 'tipoMedicId', 'especialidadId']);
  try {
    await Medicamento.create(d);
    res.redirect('/medicamentos?ok=Creado');
  } catch (e) {
    res.status(400).render('medicamentos/form', { medicamento: d, listas: await obtenerListas(), flash: { error: mensajeError(e) } });
  }
}));

router.get('/:id/editar', editar, wrap(async (req, res) => {
  const med = await Medicamento.findByPk(req.params.id);
  if (!med) return res.status(404).send('No encontrado');
  res.render('medicamentos/form', { medicamento: med, listas: await obtenerListas() });
}));

router.post('/:id/editar', editar, wrap(async (req, res) => {
  const med = await Medicamento.findByPk(req.params.id);
  if (!med) return res.status(404).send('No encontrado');
  const d = pick(req.body, ['nombre', 'precio', 'stock', 'fecha_vencimiento', 'categoriaId', 'laboratorioId', 'tipoMedicId', 'especialidadId']);
  try {
    await med.update(d);
    res.redirect('/medicamentos?ok=Actualizado');
  } catch (e) {
    res.status(400).render('medicamentos/form', { medicamento: { ...d, id: med.id }, listas: await obtenerListas(), flash: { error: mensajeError(e) } });
  }
}));

router.post('/:id/eliminar', borrar, wrap(async (req, res) => {
  await Medicamento.destroy({ where: { id: req.params.id } });
  res.redirect('/medicamentos?ok=Eliminado');
}));

module.exports = router;
