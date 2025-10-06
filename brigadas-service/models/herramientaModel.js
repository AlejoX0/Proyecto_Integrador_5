// ============================================
// MODELO: Herramientas y Uso
// Conecta las funciones SQL con la lógica del servicio
// ============================================
const pool = require('../db/postgres');

module.exports = {
  async crearHerramienta(nombre, descripcion) {
    await pool.query('SELECT crear_herramienta($1, $2)', [nombre, descripcion]);
  },

  async listarHerramientas() {
    const { rows } = await pool.query('SELECT * FROM listar_herramientas()');
    return rows;
  },

  async registrarUsoHerramienta(id_brigada, id_herramienta, fecha_uso, estado) {
    await pool.query('SELECT registrar_uso_herramienta($1, $2, $3, $4)', [
      id_brigada,
      id_herramienta,
      fecha_uso,
      estado
    ]);
  },

  async obtenerUsoHerramientas(id_brigada) {
    const { rows } = await pool.query('SELECT * FROM obtener_uso_herramientas($1)', [id_brigada]);
    return rows;
  }
};
