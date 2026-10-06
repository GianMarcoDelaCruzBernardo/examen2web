const express = require('express');
const { Op } = require('sequelize');
const { Usuario, Categoria, Medicamento } = require('../models');
const { requireAuth } = require('../middleware/auth');
const { wrap } = require('../utils/helpers');

const router = express.Router();

router.get('/', (req, res) => res.redirect(req.user ? '/menu' : '/login'));

router.get(
  '/menu',
  requireAuth,
  wrap(async (req, res) => {
    const [categorias, medicamentos, stockBajo, usuarios] = await Promise.all([
      Categoria.count(),
      Medicamento.count(),
      Medicamento.count({ where: { stock: { [Op.lt]: 10 } } }),
      req.user.rol === 'administrador' ? Usuario.count() : Promise.resolve(null),
    ]);
    res.render('menu', { stats: { categorias, medicamentos, stockBajo, usuarios } });
  })
);

module.exports = router;