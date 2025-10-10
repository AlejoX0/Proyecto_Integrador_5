// ====================================================
// SERVICIO DE USUARIOS (Sincronización entre Mongo y Postgres)
// ====================================================

const { Pool } = require("pg");
require("dotenv").config();

// ====================================================
// 🔗 CONEXIÓN A POSTGRES (Neon / Base relacional)
// ====================================================
const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: { rejectUnauthorized: false }, // requerido para Neon
});

// ====================================================
// 🔄 SINCRONIZAR USUARIO ENTRE MONGO Y POSTGRES
// ====================================================
// Se ejecuta cuando un usuario se registra en Mongo (auth-service).
// Guarda el usuario también en Postgres mediante una función almacenada.
async function sincronizarUsuario(usuario) {
  try {
    const {
      _id,
      nro_documento,
      nombre,
      apellido,
      correo,
      telefono,
      rol,
    } = usuario;

    console.log("🔄 Ejecutando sincronización de usuario en Postgres...");

    // Llamada a la función SQL en Postgres (por ejemplo: crear_usuario_desde_mongo)
    await pool.query(
      "SELECT crear_usuario_desde_mongo($1, $2, $3, $4, $5, $6, $7)",
      [_id.toString(), nro_documento, nombre, apellido, correo, telefono, rol]
    );

    console.log("✅ Usuario sincronizado correctamente en Postgres");
    return { message: "✅ Usuario sincronizado correctamente en Postgres" };
  } catch (error) {
    console.error("❌ Error al sincronizar usuario en Postgres:", error.message);
    throw new Error("Error al sincronizar usuario en Postgres");
  }
}

// ====================================================
// 🧩 CONSULTAR USUARIO DESDE POSTGRES
// ====================================================
// Otros microservicios (brigadas, muestra, etc.) pueden obtener los datos
async function obtenerUsuarioPorIdMongo(idMongo) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM obtener_usuario_por_id_mongo($1)",
      [idMongo]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("❌ Error al obtener usuario desde Postgres:", error.message);
    throw error;
  }
}

// ====================================================
// 🚀 OPCIONAL: ACTUALIZAR DATOS DE USUARIO (si se modifican en Mongo)
// ====================================================
async function actualizarUsuario(usuario) {
  try {
    const {
      _id,
      nro_documento,
      nombre,
      apellido,
      correo,
      telefono,
      rol,
    } = usuario;

    await pool.query(
      "SELECT actualizar_usuario_desde_mongo($1, $2, $3, $4, $5, $6, $7)",
      [_id.toString(), nro_documento, nombre, apellido, correo, telefono, rol]
    );

    console.log("♻️ Usuario actualizado correctamente en Postgres");
  } catch (error) {
    console.error("❌ Error al actualizar usuario en Postgres:", error.message);
    throw error;
  }
}

module.exports = {
  sincronizarUsuario,
  obtenerUsuarioPorIdMongo,
  actualizarUsuario,
};
