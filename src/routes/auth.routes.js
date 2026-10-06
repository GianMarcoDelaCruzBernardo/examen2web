const express = require('express');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const { firmar, cookieOpts } = require('../middleware/auth');
const { wrap, mensajeError } = require('../utils/helpers');

const router = express.Router();
const ROLES = ['administrador', 'moderador', 'usuario'];
const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rePass = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

router.get('/login', (req, res) => {
  if (req.user) return res.redirect('/menu');
  res.render('auth/login', { email: '' });
});

router.post(
  '/login',
  wrap(async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!reEmail.test(email) || !password) {
      return res.redirect('/login?error=' + encodeURIComponent('Ingresa un correo y una clave validos'));
    }
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.redirect('/login?error=' + encodeURIComponent('Credenciales incorrectas'));
    }
    res.cookie('token', firmar(usuario), cookieOpts());
    res.redirect('/menu');
  })
);

router.get('/registro', (req, res) => {
  if (req.user) return res.redirect('/menu');
  res.render('auth/registro', { datos: {} });
});

router.post(
  '/registro',
  wrap(async (req, res) => {
    const nombre = String(req.body.nombre || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const confirmar = String(req.body.confirmar || '');
    const rol = ROLES.includes(req.body.rol) ? req.body.rol : 'usuario';

    const fallo = (msg) =>
      res.status(400).render('auth/registro', { datos: { nombre, email, rol }, flash: { ok: null, error: msg } });

    if (nombre.length < 3) return fallo('El nombre debe tener al menos 3 caracteres');
    if (!reEmail.test(email)) return fallo('Correo electronico invalido');
    if (!rePass.test(password)) return fallo('La clave debe tener minimo 6 caracteres, con letras y numeros');
    if (password !== confirmar) return fallo('Las claves no coinciden');

    try {
      // NOTA: elegir el rol al registrarse es SOLO para la demostracion del laboratorio.
      await Usuario.create({ nombre, email, rol, password: await bcrypt.hash(password, 10) });
    } catch (e) {
      return fallo(mensajeError(e));
    }
    res.redirect('/login?ok=' + encodeURIComponent('Cuenta creada. Ya puedes iniciar sesion'));
  })
);

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login?ok=' + encodeURIComponent('Sesion cerrada correctamente'));
});

module.exports = router;
