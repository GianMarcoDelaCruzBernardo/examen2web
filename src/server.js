require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const { sequelize } = require('./models');
const seed = require('./seed');
const { attachUser } = require('./middleware/auth');

const app = express();
app.set('trust proxy', 1); // Render usa proxy (necesario para cookies secure)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (req, res) => res.send('ok')); // health check de Render

app.use(attachUser);

app.use('/api', require('./routes/api.routes'));
app.use('/', require('./routes/auth.routes'));
app.use('/', require('./routes/main.routes'));
app.use('/categorias', require('./routes/categorias.routes'));
app.use('/medicamentos', require('./routes/medicamentos.routes'));
app.use('/usuarios', require('./routes/usuarios.routes'));

app.use((req, res) => res.status(404).render('error', { codigo: 404, mensaje: 'Pagina no encontrada' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { codigo: 500, mensaje: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // crea las tablas con Sequelize si no existen
    await seed();
    app.listen(PORT, '0.0.0.0', () => console.log(`Farmacia App en http://localhost:${PORT}`));
  } catch (e) {
    console.error('No se pudo iniciar la aplicacion:', e);
    process.exit(1);
  }
})();
