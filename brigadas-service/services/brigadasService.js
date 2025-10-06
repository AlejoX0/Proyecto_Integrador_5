import pool from "../db/postgres.js";

// ====================================================
// SERVICIO DE BRIGADAS
// Casos de uso relacionados con:
//  - Creación de brigadas (Administrador)
//  - Asignación de conglomerados (Jefe de brigada)
//  - Consulta de brigadas (todos los roles)
// ====================================================

// 👨‍💼 CU1 - Crear brigada (rol: administrador)
export const crearBrigada = async (nombre, fecha_asignacion, id_conglomerado, lider) => {
  await pool.query(
    "SELECT crear_brigada($1, $2, $3, $4)",
    [nombre, fecha_asignacion, id_conglomerado, lider]
  );
  return { message: "✅ Brigada creada correctamente" };
};

// 👷 CU2 - Asignar conglomerado a brigada (rol: jefe)
export const asignarConglomerado = async (id_brigada, id_conglomerado) => {
  await pool.query("SELECT asignar_conglomerado_a_brigada($1, $2)", [id_brigada, id_conglomerado]);
  return { message: "✅ Conglomerado asignado a brigada" };
};

// 👀 CU3 - Listar brigadas (rol: todos)
export const listarBrigadas = async () => {
  const { rows } = await pool.query("SELECT * FROM listar_brigadas()");
  return rows;
};
