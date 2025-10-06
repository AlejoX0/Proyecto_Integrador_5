import pool from "../db/postgres.js";

// ====================================================
// SERVICIO DE USUARIO - BRIGADA
// Casos de uso:
//  - Asignar usuario a brigada (Administrador / Jefe)
//  - Listar integrantes (Jefe / Administrador)
//  - Eliminar usuario (Administrador)
// ====================================================

// 👤 CU4 - Asignar usuario a brigada
export const asignarUsuarioABrigada = async (id_usuario, id_brigada, rol_en_brigada) => {
  await pool.query("SELECT asignar_usuario_a_brigada($1, $2, $3)", [
    id_usuario,
    id_brigada,
    rol_en_brigada,
  ]);
  return { message: "✅ Usuario asignado correctamente a la brigada" };
};

// 👥 CU5 - Listar usuarios en brigada
export const listarIntegrantes = async (id_brigada) => {
  const { rows } = await pool.query("SELECT * FROM listar_usuarios_de_brigada($1)", [id_brigada]);
  return rows;
};

// ❌ CU6 - Eliminar usuario de brigada
export const eliminarUsuarioDeBrigada = async (id_usuario, id_brigada) => {
  await pool.query("SELECT remover_usuario_de_brigada($1, $2)", [id_usuario, id_brigada]);
  return { message: "✅ Usuario eliminado correctamente de la brigada" };
};
