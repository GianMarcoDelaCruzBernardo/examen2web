// API REST protegida con JWT (Authorization: Bearer <token>)
const express = require('express');
const bcrypt = require('bcryptjs');
const { Usuario, Categoria, Medicamento } = require('../models');
const { firmar, requireAuth, requireRole } = require('../middleware/auth');
const { wrap, mensajeError, pick } = require('../utils/helpers');

const router = express.Router();

// --- Autenticacion ---
router.post(
  '/auth/login',
  wrap(async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !(await bcrypt.compare(String(req.body.password || ''), usuario.password))) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    res.json({
      token: firmar(usuario),
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    });
  })
);

router.post(
  '/auth/register',
  wrap(async (req, res) => {
    const { nombre, email, password } = req.body;
    if (!password || String(password).length < 6) return res.status(400).json({ error: 'Clave minima de 6 caracteres' });
    const u = await Usuario.create({
      nombre,
      email: String(email || '').toLowerCase(),
      password: await bcrypt.hash(String(password), 10),
      rol: 'usuario',
    });
    res.status(201).json({ id: u.id, nombre: u.nombre, email: u.email, rol: u.rol });
  })
);

router.get('/auth/me', requireAuth, (req, res) => res.json(req.user));

// --- CRUD generico con Sequelize ---
function crud(Model, campos, include) {
  const r = express.Router();
  r.get('/', requireAuth, wrap(async (req, res) => res.json(await Model.findAll({ include }))));
  r.get(
    '/:id',
    requireAuth,
    wrap(async (req, res) => {
      const x = await Model.findByPk(req.params.id, { include });
      if (!x) return res.status(404).json({ error: 'No encontrado' });
      res.json(x);
    })
  );
  r.post(
    '/',
    requireRole('administrador', 'moderador'),
    wrap(async (req, res) => res.status(201).json(await Model.create(pick(req.body, campos))))
  );
  r.put(
    '/:id',
    requireRole('administrador', 'moderador'),
    wrap(async (req, res) => {
      const x = await Model.findByPk(req.params.id);
      if (!x) return res.status(404).json({ error: 'No encontrado' });
      res.json(await x.update(pick(req.body, campos)));
    })
  );
  r.delete(
    '/:id',
    requireRole('administrador'),
    wrap(async (req, res) => {
      const n = await Model.destroy({ where: { id: req.params.id } });
      if (!n) return res.status(404).json({ error: 'No encontrado' });
      res.json({ eliminado: true });
    })
  );
  return r;
}

router.use('/categorias', crud(Categoria, ['nombre', 'descripcion'], [{ model: Medicamento, as: 'medicamentos' }]));
router.use(
  '/medicamentos',
  crud(Medicamento, ['nombre', 'laboratorio', 'precio', 'stock', 'fecha_vencimiento', 'categoriaId'], [
    { model: Categoria, as: 'categoria' },
  ])
);

router.use((req, res) => res.status(404).json({ error: 'Ruta de API no encontrada' }));
// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => res.status(400).json({ error: mensajeError(err) }));

module.exports = router;
