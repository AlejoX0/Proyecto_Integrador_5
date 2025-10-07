// ===========================================
// MODELO: Brigada (DAO)
// Maneja las consultas SQL a la tabla "brigada"
// ===========================================
import pool from '../db/postgres.js';

const Brigada = {
  async crear(nombre, fecha_asignacion, id_conglomerado, lider) {
    await pool.query(
      'SELECT crear_brigada($1, $2, $3, $4)',
      [nombre, fecha_asignacion, id_conglomerado, lider]
    );
  },

  async listar() {
    const { rows } = await pool.query('SELECT * FROM listar_brigadas()');
    return rows;
  },

  async obtenerPorId(id_brigada) {
    const { rows } = await pool.query('SELECT * FROM obtener_brigada($1)', [id_brigada]);
    return rows[0];
  },

  async eliminar(id_brigada) {
    await pool.query('SELECT eliminar_brigada($1)', [id_brigada]);
  }
};

export default Brigada;
