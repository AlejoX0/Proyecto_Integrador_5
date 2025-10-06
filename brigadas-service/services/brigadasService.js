import pool from "../db/postgres.js";

// =============================================
// SERVICIO: Brigadas
// Lógica de negocio de brigadas y asignación
// =============================================

// 👨‍💼 Caso de uso: Crear brigada (rol: administrador)
export const crearBrigada = async (nombre, fecha_asignacion, id_conglomerado, lider) => {
  await pool.query("SELECT crear_brigada($1, $2, $3, $4)", [nombre, fecha_asignacion, id_conglomerado, lider]);
  return { message: "Brigada creada correctamente" };
};

// 👷 Caso de uso: Asignar conglomerado a brigada
export const asignarConglomerado = async (id_brigada, id_conglomerado) => {
  await pool.query("SELECT asignar_conglomerado_a_brigada($1, $2)", [id_brigada, id_conglomerado]);
  return { message: "Conglomerado asignado a brigada" };
};

// 👀 Caso de uso: Listar brigadas
export const listarBrigadas = async () => {
  const { rows } = await pool.query("SELECT * FROM listar_brigadas()");
  return rows;
};
