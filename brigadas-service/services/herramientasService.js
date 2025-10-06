import pool from "../db/postgres.js";

// ====================================================
// SERVICIO DE HERRAMIENTAS
// Casos de uso relacionados con:
//  - Registro de herramientas (Administrador)
//  - Registro de uso (Jefe / Brigadista)
//  - Consulta de inventario (todos los roles)
// ====================================================

// 🧰 CU7 - Crear herramienta (rol: administrador)
export const crearHerramienta = async ({ nombre, tipo, descripcion, cantidad_disponible }) => {
  const result = await pool.query(
    "SELECT crear_herramienta($1, $2, $3, $4) AS nueva;",
    [nombre, tipo, descripcion, cantidad_disponible]
  );
  return result.rows[0].nueva;
};

// 👀 CU9 - Listar herramientas (rol: todos)
export const listarHerramientas = async () => {
  const result = await pool.query("SELECT * FROM obtener_herramientas();");
  return result.rows;
};

// 🛠️ CU8 - Registrar uso de herramienta (rol: jefe / brigadista)
export const registrarUso = async ({ id_herramienta, id_usuario, id_brigada, cantidad_usada }) => {
  const result = await pool.query(
    "SELECT registrar_uso_herramienta($1, $2, $3, $4) AS registro;",
    [id_herramienta, id_usuario, id_brigada, cantidad_usada]
  );
  return result.rows[0].registro;
};

// 📊 CU9 - Obtener uso de herramientas por brigada
export const obtenerUso = async (id_brigada) => {
  const result = await pool.query("SELECT * FROM obtener_uso_por_brigada($1);", [id_brigada]);
  return result.rows;
};
