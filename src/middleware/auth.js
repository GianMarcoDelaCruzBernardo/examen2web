const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'clave-solo-desarrollo-cambiala';
if (!process.env.JWT_SECRET) console.warn('[AVISO] JWT_SECRET no definido, usando clave de desarrollo.');

const DURACION_MS = 2 * 60 * 60 * 1000; // 2 horas

const cookieOpts = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: DURACION_MS,
});

// Crea el JWT
function firmar(u) {
  return jwt.sign({ id: u.id, nombre: u.nombre, email: u.email, rol: u.rol }, SECRET, { expiresIn: '2h' });
}

// Lee el token: header "Authorization: Bearer ..." o cookie "token"
function extraerToken(req) {
  const h = req.headers.authorization;
  if (h && h.startsWith('Bearer ')) return h.slice(7);
  return req.cookies && req.cookies.token;
}

// Global: si hay token valido, deja el usuario en req.user y en las vistas
function attachUser(req, res, next) {
  req.user = null;
  const token = extraerToken(req);
  if (token) {
    try {
      req.user = jwt.verify(token, SECRET);
    } catch (e) {
      req.user = null;
    }
  }
  res.locals.user = req.user;
  res.locals.flash = { ok: req.query.ok || null, error: req.query.error || null };
  res.locals.path = req.path;
  next();
}

const esApi = (req) => req.originalUrl.startsWith('/api');

function requireAuth(req, res, next) {
  if (req.user) return next();
  if (esApi(req)) return res.status(401).json({ error: 'Token requerido o invalido' });
  return res.redirect('/login?error=' + encodeURIComponent('Debes iniciar sesion'));
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return requireAuth(req, res, next);
    if (roles.includes(req.user.rol)) return next();
    if (esApi(req)) return res.status(403).json({ error: 'No tienes permisos para esta accion' });
    return res.status(403).render('error', { codigo: 403, mensaje: 'No tienes permisos para acceder a esta seccion.' });
  };
}

module.exports = { firmar, attachUser, requireAuth, requireRole, cookieOpts };
