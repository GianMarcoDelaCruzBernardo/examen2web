const express = require('express');
const { Categoria, Medicamento } = require('../models');
const { requireAuth, requireRole } = require('../middleware/auth');
const { wrap, mensajeError, pick } = require('../utils/helpers');

const router = express.Router();
const editar = requireRole('administrador', 'moderador');
const borrar = requireRole('administrador');

router.use(requireAuth);

function datosDe(body) {
  const d = pick(body, ['nombre', 'laboratorio', 'precio', 'stock', 'fecha_vencimiento', 'categoriaId']);
  d.nombre = String(d.nombre || '').trim();
  d.laboratorio = String(d.laboratorio || '').trim() || null;
  d.fecha_vencimiento = d.fecha_vencimiento || null;
  return d;
}

function validar(d) {
  if (d.nombre.length < 2) return 'El nombre debe tener al menos 2 caracteres';
  if (d.precio === undefined || d.precio === '' || isNaN(Number(d.precio)) || Number(d.precio) < 0)
    return 'El precio debe ser un numero mayor o igual a 0';
  if (!/^\d+$/.test(String(d.stock))) return 'El stock debe ser un entero mayor o igual a 0';
  if (!d.categoriaId) return 'Selecciona una categoria';
  return null;
}

const listaCategorias = () => Categoria.findAll({ order: [['nombre', 'ASC']] });

// READ (lista con su categoria)
router.get(
  '/',
  wrap(async (req, res) => {
    const medicamentos = await Medicamento.findAll({
      include: [{ model: Categoria, as: 'categoria' }],
      order: [['nombre', 'ASC']],
    });
    res.render('medicamentos/index', { medicamentos });
  })
);

// CREATE
router.get(
  '/nuevo',
  editar,
  wrap(async (req, res) => {
    res.render('medicamentos/form', { medicamento: null, categorias: await listaCategorias() });
  })
);

router.post(
  '/',
  editar,
  wrap(async (req, res) => {
    const d = datosDe(req.body);
    let error = validar(d);
    if (!error) {
      try {
        await Medicamento.create(d);
      } catch (e) {
        error = mensajeError(e);
      }
    }
    if (error) {
      return res
        .status(400)
        .render('medicamentos/form', { medicamento: d, categorias: await listaCategorias(), flash: { ok: null, error } });
    }
    res.redirect('/medicamentos?ok=' + encodeURIComponent('Medicamento creado'));
  })
);

// UPDATE
router.get(
  '/:id/editar',
  editar,
  wrap(async (req, res) => {
    const medicamento = await Medicamento.findByPk(req.params.id);
    if (!medicamento) return res.status(404).render('error', { codigo: 404, mensaje: 'Medicamento no encontrado' });
    res.render('medicamentos/form', { medicamento, categorias: await listaCategorias() });
  })
);

router.post(
  '/:id/editar',
  editar,
  wrap(async (req, res) => {
    const medicamento = await Medicamento.findByPk(req.params.id);
    if (!medicamento) return res.status(404).render('error', { codigo: 404, mensaje: 'Medicamento no encontrado' });
    const d = datosDe(req.body);
    let error = validar(d);
    if (!error) {
      try {
        await medicamento.update(d);
      } catch (e) {
        error = mensajeError(e);
      }
    }
    if (error) {
      return res.status(400).render('medicamentos/form', {
        medicamento: { ...d, id: medicamento.id },
        categorias: await listaCategorias(),
        flash: { ok: null, error },
      });
    }
    res.redirect('/medicamentos?ok=' + encodeURIComponent('Medicamento actualizado'));
  })
);

// DELETE (solo administrador)
router.post(
  '/:id/eliminar',
  borrar,
  wrap(async (req, res) => {
    await Medicamento.destroy({ where: { id: req.params.id } });
    res.redirect('/medicamentos?ok=' + encodeURIComponent('Medicamento eliminado'));
  })
);

module.exports = router;
