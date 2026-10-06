const express = require('express');
const { Laboratorio, Medicamento } = require('../models');
const { requireAuth, requireRole } = require('../middleware/auth');
const { wrap, mensajeError, pick } = require('../utils/helpers');

const router = express.Router();
const editar = requireRole('administrador', 'moderador');
const borrar = requireRole('administrador');
router.use(requireAuth);

router.get('/', wrap(async (req, res) => {
  const laboratorios = await Laboratorio.findAll({
    include: [{ model: Medicamento, as: 'medicamentos', attributes: ['id'] }],
    order: [['razonSocial', 'ASC']]
  });
  res.render('laboratorios/index', { laboratorios });
}));

router.get('/nuevo', editar, (req, res) => res.render('laboratorios/form', { laboratorio: null }));

router.post('/', editar, wrap(async (req, res) => {
  const d = pick(req.body, ['razonSocial', 'direccion', 'telefono', 'email', 'contacto']);
  try {
    await Laboratorio.create(d);
    res.redirect('/laboratorios?ok=Laboratorio creado');
  } catch (e) {
    res.status(400).render('laboratorios/form', { laboratorio: d, flash: { error: mensajeError(e) } });
  }
}));

router.get('/:id/editar', editar, wrap(async (req, res) => {
  const lab = await Laboratorio.findByPk(req.params.id);
  if (!lab) return res.status(404).send('No encontrado');
  res.render('laboratorios/form', { laboratorio: lab });
}));

router.post('/:id/editar', editar, wrap(async (req, res) => {
  const lab = await Laboratorio.findByPk(req.params.id);
  if (!lab) return res.status(404).send('No encontrado');
  const d = pick(req.body, ['razonSocial', 'direccion', 'telefono', 'email', 'contacto']);
  try {
    await lab.update(d);
    res.redirect('/laboratorios?ok=Actualizado');
  } catch (e) {
    res.status(400).render('laboratorios/form', { laboratorio: { ...d, id: lab.id }, flash: { error: mensajeError(e) } });
  }
}));

router.post('/:id/eliminar', borrar, wrap(async (req, res) => {
  try {
    await Laboratorio.destroy({ where: { id: req.params.id } });
    res.redirect('/laboratorios?ok=Eliminado');
  } catch (e) {
    res.redirect('/laboratorios?error=No se puede eliminar: tiene medicamentos asociados');
  }
}));

module.exports = router;
