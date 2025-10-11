// ====================================================
// SERVICIO DE USUARIO - BRIGADA (con requery)
// ====================================================

const pool = require("../db/postgres");

// 👤 CU4 - Asignar usuario a brigada
async function asignarUsuarioABrigada(id_usuario, id_brigada, rol_en_brigada) {
  await pool.query("SELECT asignar_usuario_a_brigada($1, $2, $3)", [
    id_usuario,
    id_brigada,
    rol_en_brigada,
  ]);
  return { message: "✅ Usuario asignado correctamente a la brigada" };
}

// 👥 CU5 - Listar usuarios en brigada
async function listarIntegrantes(id_brigada) {
  const { rows } = await pool.query(
    "SELECT * FROM listar_usuarios_de_brigada($1)",
    [id_brigada]
  );
  return rows;
}

// 🔍 Verificar si un usuario pertenece a una brigada
async function verificarUsuarioEnBrigada(id_usuario, id_brigada) {
  const { rows } = await pool.query(
    "SELECT 1 FROM usuario_brigada WHERE id_usuario = $1 AND id_brigada = $2",
    [id_usuario, id_brigada]
  );
  return rows.length > 0;
}

// ❌ CU6 - Eliminar usuario de brigada
async function eliminarUsuarioDeBrigada(id_usuario, id_brigada) {
  await pool.query("SELECT remover_usuario_de_brigada($1, $2)", [id_usuario, id_brigada]);
  return { message: "✅ Usuario eliminado correctamente de la brigada" };
}

module.exports = {
  asignarUsuarioABrigada,
  listarIntegrantes,
  eliminarUsuarioDeBrigada,
  verificarUsuarioEnBrigada,
};
