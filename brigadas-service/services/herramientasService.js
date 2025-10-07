// ====================================================
// SERVICIO DE HERRAMIENTAS
// ====================================================

const pool = require("../db/postgres");

// 🧰 CU7 - Crear herramienta (rol: administrador)
async function crearHerramienta({ nombre, tipo, descripcion, cantidad_disponible }) {
  const result = await pool.query(
    "SELECT crear_herramienta($1, $2, $3, $4) AS nueva;",
    [nombre, tipo, descripcion, cantidad_disponible]
  );
  return result.rows[0].nueva;
}

// 👀 CU9 - Listar herramientas (rol: todos)
async function listarHerramientas() {
  const result = await pool.query("SELECT * FROM obtener_herramientas();");
  return result.rows;
}

// 🛠️ CU8 - Registrar uso de herramienta (rol: jefe / brigadista)
async function registrarUso({ id_herramienta, id_usuario, id_brigada, cantidad_usada }) {
  const result = await pool.query(
    "SELECT registrar_uso_herramienta($1, $2, $3, $4) AS registro;",
    [id_herramienta, id_usuario, id_brigada, cantidad_usada]
  );
  return result.rows[0].registro;
}

// 📊 CU9 - Obtener uso de herramientas por brigada
async function obtenerUso(id_brigada) {
  const result = await pool.query("SELECT * FROM obtener_uso_por_brigada($1);", [id_brigada]);
  return result.rows;
}

module.exports = {
  crearHerramienta,
  listarHerramientas,
  registrarUso,
  obtenerUso,
};
