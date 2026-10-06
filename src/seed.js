const bcrypt = require('bcryptjs');
const { Usuario, Categoria, Medicamento } = require('./models');

module.exports = async function seed() {
  if ((await Usuario.count()) === 0) {
    const usuarios = [
      { nombre: 'Administrador', email: 'admin@farmacia.com', pass: 'Admin123', rol: 'administrador' },
      { nombre: 'Moderador', email: 'moderador@farmacia.com', pass: 'Mod12345', rol: 'moderador' },
      { nombre: 'Usuario Demo', email: 'usuario@farmacia.com', pass: 'User12345', rol: 'usuario' },
    ];
    for (const u of usuarios) {
      await Usuario.create({
        nombre: u.nombre,
        email: u.email,
        rol: u.rol,
        password: await bcrypt.hash(u.pass, 10),
      });
    }
    console.log('[seed] Usuarios insertados');
  }

  if ((await Categoria.count()) === 0) {
    const nombres = [
      ['Analgesicos', 'Alivian el dolor y la fiebre'],
      ['Antibioticos', 'Combaten infecciones bacterianas'],
      ['Antialergicos', 'Tratan alergias y rinitis'],
      ['Vitaminas', 'Suplementos vitaminicos y minerales'],
      ['Antiinflamatorios', 'Reducen inflamacion y dolor muscular'],
    ];
    const cat = {};
    for (const [nombre, descripcion] of nombres) {
      cat[nombre] = await Categoria.create({ nombre, descripcion });
    }

    const hoy = new Date();
    const enMeses = (m) => {
      const d = new Date(hoy);
      d.setMonth(d.getMonth() + m);
      return d.toISOString().slice(0, 10);
    };

    const meds = [
      ['Paracetamol 500 mg', 'Genfar', 0.5, 200, 18, 'Analgesicos'],
      ['Ibuprofeno 400 mg', 'Bayer', 0.9, 150, 14, 'Antiinflamatorios'],
      ['Amoxicilina 500 mg', 'Medifarma', 1.5, 80, 20, 'Antibioticos'],
      ['Azitromicina 500 mg', 'Pfizer', 4.2, 40, 24, 'Antibioticos'],
      ['Loratadina 10 mg', 'Portugal', 0.6, 120, 16, 'Antialergicos'],
      ['Cetirizina 10 mg', 'Teva', 0.7, 8, 12, 'Antialergicos'],
      ['Vitamina C 1 g', 'Bayer', 1.2, 300, 22, 'Vitaminas'],
      ['Naproxeno 550 mg', 'Roche', 1.1, 5, 10, 'Antiinflamatorios'],
    ];
    for (const [nombre, laboratorio, precio, stock, meses, c] of meds) {
      await Medicamento.create({
        nombre,
        laboratorio,
        precio,
        stock,
        fecha_vencimiento: enMeses(meses),
        categoriaId: cat[c].id,
      });
    }
    console.log('[seed] Categorias y medicamentos insertados');
  }
};
