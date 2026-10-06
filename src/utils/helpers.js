// Captura errores de funciones async en Express 4
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function mensajeError(e) {
  if (e.name === 'SequelizeUniqueConstraintError') return 'Ya existe un registro con ese valor (duplicado).';
  if (e.name === 'SequelizeForeignKeyConstraintError')
    return 'Operacion no permitida: hay registros relacionados o la referencia no existe.';
  if (e.name === 'SequelizeValidationError') return e.errors.map((x) => x.message).join('. ');
  return e.message || 'Error inesperado';
}

function pick(obj, keys) {
  const out = {};
  keys.forEach((k) => {
    if (obj && obj[k] !== undefined) out[k] = obj[k];
  });
  return out;
}

module.exports = { wrap, mensajeError, pick };
