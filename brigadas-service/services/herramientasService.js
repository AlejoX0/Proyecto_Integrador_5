// ====================================================
// SERVICIO DE HERRAMIENTAS (Versión final y sincronizada)
// ====================================================

const pool = require("../db/postgres");

// 🧰 CU7 - Crear herramienta (rol: administrador)
async function crearHerramienta({
  nombre,
  tipo,
  descripcion,
  cantidad_disponible = 0,
}) {
  try {
    const result = await pool.query(
      "SELECT crear_herramienta($1, $2, $3, $4) AS herramienta;",
      [nombre, tipo, descripcion, cantidad_disponible]
    );

    // Validar que haya retornado algo
    if (!result.rows.length || !result.rows[0].herramienta) {
      throw new Error("No se pudo crear la herramienta");
    }

    return result.rows[0].herramienta;
  } catch (error) {
    console.error("❌ Error en crearHerramienta:", error.message);
    throw new Error("Error interno al crear herramienta");
  }
}

// 👀 CU9 - Listar herramientas (rol: todos)
async function listarHerramientas() {
  try {
    const result = await pool.query("SELECT * FROM obtener_herramientas();");
    return result.rows;
  } catch (error) {
    console.error("❌ Error en listarHerramientas:", error.message);
    throw new Error("Error al listar herramientas");
  }
}

// 🛠️ CU8 - Registrar uso de herramienta (rol: jefe / brigadista)
async function registrarUso({ id_herramienta, id_brigada, estado = "activo" }) {
  try {
    const result = await pool.query(
      "SELECT registrar_uso_herramienta($1, $2, $3) AS uso;",
      [id_herramienta, id_brigada, estado]
    );

    if (!result.rows.length || !result.rows[0].uso) {
      throw new Error("No se pudo registrar el uso de la herramienta");
    }

    return result.rows[0].uso;
  } catch (error) {
    console.error("❌ Error en registrarUso:", error.message);
    throw new Error("Error al registrar uso de herramienta");
  }
}

// 📊 CU9 - Obtener uso de herramientas por brigada
async function obtenerUso(id_brigada) {
  try {
    const result = await pool.query(
      "SELECT * FROM obtener_uso_por_brigada($1);",
      [id_brigada]
    );

    return result.rows;
  } catch (error) {
    console.error("❌ Error en obtenerUso:", error.message);
    throw new Error("Error al obtener uso de herramientas");
  }
}

module.exports = {
  crearHerramienta,
  listarHerramientas,
  registrarUso,
  obtenerUso,
};
