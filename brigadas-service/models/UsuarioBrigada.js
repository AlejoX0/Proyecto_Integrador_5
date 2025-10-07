// ============================================
// MODELO: UsuarioBrigada (DAO)
// Representa la relación entre brigadas y usuarios
// Tabla: brigada_usuario
// ============================================
import pool from '../db/postgres.js';

const UsuarioBrigada = {
  async asignarUsuario(id_brigada, id_usuario, rol_en_brigada, fecha_inicio, fecha_fin) {
    await pool.query(
      'SELECT asignar_usuario_brigada($1, $2, $3, $4, $5)',
      [id_brigada, id_usuario, rol_en_brigada, fecha_inicio, fecha_fin]
    );
  },

  async listarPorBrigada(id_brigada) {
    const { rows } = await pool.query('SELECT * FROM listar_usuarios_brigada($1)', [id_brigada]);
    return rows;
  },

  async removerUsuario(id_brigada, id_usuario) {
    await pool.query('SELECT remover_usuario_brigada($1, $2)', [id_brigada, id_usuario]);
  }
};

export default UsuarioBrigada;
