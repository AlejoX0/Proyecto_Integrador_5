// ===========================================
// MODELO: Brigada (DAO)
// Maneja las consultas SQL a la tabla "brigada"
// ===========================================
import pool from '../db/postgres.js';

const Brigada = {
  // 🔹 Crear brigada
  async crear(departamento, fecha_asignacion, id_conglomerado, lider) {
    await pool.query(
      'SELECT crear_brigada($1, $2, $3, $4)',
      [departamento, fecha_asignacion, id_conglomerado, lider]
    );
  },

  // 🔹 Listar todas las brigadas
  async listar() {
    const { rows } = await pool.query('SELECT * FROM listar_brigadas()');
    return rows;
  },

  // 🔹 Obtener una brigada por su ID
  async obtenerPorId(id_brigada) {
    const { rows } = await pool.query('SELECT * FROM obtener_brigada($1)', [id_brigada]);
    return rows[0];
  },

  // 🔹 Eliminar una brigada por su ID
  async eliminar(id_brigada) {
    await pool.query('SELECT eliminar_brigada($1)', [id_brigada]);
  }
};

export default Brigada;
