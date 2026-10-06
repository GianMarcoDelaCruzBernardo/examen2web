const express = require('express');
const { Usuario } = require('../models');
const { requireRole } = require('../middleware/auth');
const { wrap } = require('../utils/helpers');

const router = express.Router();
const ROLES = ['administrador', 'moderador', 'usuario'];

router.use(requireRole('administrador'));

router.get(
  '/',
  wrap(async (req, res) => {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['password'] }, order: [['id', 'ASC']] });
    res.render('usuarios/index', { usuarios, roles: ROLES });
  })
);

router.post(
  '/:id/rol',
  wrap(async (req, res) => {
    if (!ROLES.includes(req.body.rol)) return res.redirect('/usuarios?error=' + encodeURIComponent('Rol invalido'));
    if (Number(req.params.id) === req.user.id)
      return res.redirect('/usuarios?error=' + encodeURIComponent('No puedes cambiar tu propio rol'));
    await Usuario.update({ rol: req.body.rol }, { where: { id: req.params.id } });
    res.redirect('/usuarios?ok=' + encodeURIComponent('Rol actualizado'));
  })
);

router.post(
  '/:id/eliminar',
  wrap(async (req, res) => {
    if (Number(req.params.id) === req.user.id)
      return res.redirect('/usuarios?error=' + encodeURIComponent('No puedes eliminar tu propia cuenta'));
    await Usuario.destroy({ where: { id: req.params.id } });
    res.redirect('/usuarios?ok=' + encodeURIComponent('Usuario eliminado'));
  })
);

module.exports = router;
