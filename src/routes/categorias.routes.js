const express = require('express');
const { Categoria, Medicamento } = require('../models');
const { requireAuth, requireRole } = require('../middleware/auth');
const { wrap, mensajeError, pick } = require('../utils/helpers');

const router = express.Router();
const editar = requireRole('administrador', 'moderador');
const borrar = requireRole('administrador');

router.use(requireAuth);

// READ (lista)
router.get(
  '/',
  wrap(async (req, res) => {
    const categorias = await Categoria.findAll({
      include: [{ model: Medicamento, as: 'medicamentos', attributes: ['id'] }],
      order: [['nombre', 'ASC']],
    });
    res.render('categorias/index', { categorias });
  })
);

// CREATE
router.get('/nueva', editar, (req, res) => res.render('categorias/form', { categoria: null }));

router.post(
  '/',
  editar,
  wrap(async (req, res) => {
    const datos = pick(req.body, ['nombre', 'descripcion']);
    datos.nombre = (datos.nombre || '').trim();
    try {
      await Categoria.create(datos);
    } catch (e) {
      return res.status(400).render('categorias/form', { categoria: datos, flash: { ok: null, error: mensajeError(e) } });
    }
    res.redirect('/categorias?ok=' + encodeURIComponent('Categoria creada'));
  })
);

// UPDATE
router.get(
  '/:id/editar',
  editar,
  wrap(async (req, res) => {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).render('error', { codigo: 404, mensaje: 'Categoria no encontrada' });
    res.render('categorias/form', { categoria });
  })
);

router.post(
  '/:id/editar',
  editar,
  wrap(async (req, res) => {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).render('error', { codigo: 404, mensaje: 'Categoria no encontrada' });
    const datos = pick(req.body, ['nombre', 'descripcion']);
    datos.nombre = (datos.nombre || '').trim();
    try {
      await categoria.update(datos);
    } catch (e) {
      return res
        .status(400)
        .render('categorias/form', { categoria: { ...datos, id: categoria.id }, flash: { ok: null, error: mensajeError(e) } });
    }
    res.redirect('/categorias?ok=' + encodeURIComponent('Categoria actualizada'));
  })
);

// DELETE (solo administrador)
router.post(
  '/:id/eliminar',
  borrar,
  wrap(async (req, res) => {
    try {
      await Categoria.destroy({ where: { id: req.params.id } });
    } catch (e) {
      return res.redirect(
        '/categorias?error=' + encodeURIComponent('No se puede eliminar: la categoria tiene medicamentos asociados')
      );
    }
    res.redirect('/categorias?ok=' + encodeURIComponent('Categoria eliminada'));
  })
);

module.exports = router;
