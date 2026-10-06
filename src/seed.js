const bcrypt = require('bcryptjs');
const { Usuario, Categoria, Medicamento, Laboratorio, TipoMedic, Especialidad } = require('./models');

module.exports = async function seed() {
  if ((await Usuario.count()) === 0) {
    await Usuario.bulkCreate([
      { nombre: 'Admin', email: 'admin@farmacia.com', rol: 'administrador', password: await bcrypt.hash('Admin123', 10) },
      { nombre: 'Moderador', email: 'mod@farmacia.com', rol: 'moderador', password: await bcrypt.hash('Mod12345', 10) },
      { nombre: 'Usuario', email: 'user@farmacia.com', rol: 'usuario', password: await bcrypt.hash('User12345', 10) }
    ]);
  }

  if ((await Laboratorio.count()) === 0) {
    await Laboratorio.bulkCreate([
      { razonSocial: 'Bayer S.A.', direccion: 'Av. Principal 123', telefono: '01-2345678', email: 'bayer@lab.com', contacto: 'Juan P.' },
      { razonSocial: 'Pfizer', direccion: 'Calle Salud 456', telefono: '01-8765432', email: 'pfizer@lab.com', contacto: 'Maria G.' },
      { razonSocial: 'Genfar', direccion: 'Jr. Med 789', telefono: '01-3456789', email: 'genfar@lab.com', contacto: 'Carlos L.' }
    ]);
  }

  if ((await TipoMedic.count()) === 0) {
    await TipoMedic.bulkCreate([
      { descripcion: 'Tableta' }, { descripcion: 'Jarabe' }, { descripcion: 'Inyeccion' }, { descripcion: 'Cremas' }
    ]);
  }

  if ((await Especialidad.count()) === 0) {
    await Especialidad.bulkCreate([
      { descripcionEsp: 'Cardiologia' }, { descripcionEsp: 'Pediatria' }, { descripcionEsp: 'Dermatologia' }, { descripcionEsp: 'General' }
    ]);
  }

  if ((await Categoria.count()) === 0) {
    await Categoria.bulkCreate([
      { nombre: 'Analgesicos', descripcion: 'Alivian dolor' },
      { nombre: 'Antibioticos', descripcion: 'Infecciones' }
    ]);
  }

  if ((await Medicamento.count()) === 0) {
    const cats = await Categoria.findAll();
    const labs = await Laboratorio.findAll();
    const tipos = await TipoMedic.findAll();
    const esp = await Especialidad.findAll();
    
    await Medicamento.bulkCreate([
      { nombre: 'Paracetamol 500mg', precio: 0.5, stock: 100, fecha_vencimiento: '2025-12-31', categoriaId: cats[0].id, laboratorioId: labs[0].CodLab, tipoMedicId: tipos[0].CodTipoMed, especialidadId: esp[3].CodEspec },
      { nombre: 'Amoxicilina 500mg', precio: 1.5, stock: 50, fecha_vencimiento: '2025-11-30', categoriaId: cats[1].id, laboratorioId: labs[1].CodLab, tipoMedicId: tipos[0].CodTipoMed, especialidadId: esp[1].CodEspec }
    ]);
  }
  console.log('[seed] Datos base insertados');
};
