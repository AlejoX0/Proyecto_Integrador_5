// ====================================================
// SERVICIO DE USUARIOS (Sincronización entre Mongo y Postgres - Compatible con Neon)
// ====================================================

const { Pool } = require("pg");
require("dotenv").config();

// ====================================================
// 🔗 CONEXIÓN A POSTGRES (Neon / Base relacional)
// ====================================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // usar DATABASE_URL de Neon
  ssl: { rejectUnauthorized: false },        // requerido para Neon
});

// ====================================================
// 🔄 SINCRONIZAR USUARIO ENTRE MONGO Y POSTGRES
// ====================================================
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
      password,
      departamento, // 👈 Nuevo campo
    } = usuario;

    console.log("🔄 Ejecutando sincronización de usuario en Postgres...");
    console.log("Datos a sincronizar:", usuario);

    const query = `
      INSERT INTO usuario (id_usuario, id_mongo, nombre, apellido, correo, telefono, contrasena, rol, departamento)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id_mongo)
      DO UPDATE SET
        nombre = EXCLUDED.nombre,
        apellido = EXCLUDED.apellido,
        correo = EXCLUDED.correo,
        telefono = EXCLUDED.telefono,
        contrasena = EXCLUDED.contrasena,
        rol = EXCLUDED.rol,
        departamento = EXCLUDED.departamento;
    `;

    await pool.query(query, [
      parseInt(nro_documento),
      _id.toString(),
      nombre,
      apellido,
      correo,
      telefono || null,
      password || null,
      rol,
      departamento || null,
    ]);

    console.log("✅ Usuario sincronizado correctamente en Postgres");
    return { message: "✅ Usuario sincronizado correctamente en Postgres" };
  } catch (error) {
    console.error("❌ Error al sincronizar usuario en Postgres:", error);
    throw new Error("Error al sincronizar usuario en Postgres");
  }
}

// ====================================================
// 🧩 CONSULTAR USUARIO DESDE POSTGRES
// ====================================================
async function obtenerUsuarioPorIdMongo(idMongo) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM usuario WHERE id_mongo = $1",
      [idMongo]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("❌ Error al obtener usuario desde Postgres:", error);
    throw error;
  }
}

// ====================================================
// 🚀 ACTUALIZAR DATOS DE USUARIO (si se modifican en Mongo)
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
      password,
      departamento, // 👈 Nuevo campo
    } = usuario;

    const query = `
      UPDATE usuario SET
        nombre = $1,
        apellido = $2,
        correo = $3,
        telefono = $4,
        contrasena = $5,
        rol = $6,
        departamento = $7
      WHERE id_mongo = $8;
    `;

    await pool.query(query, [
      nombre,
      apellido,
      correo,
      telefono || null,
      password || null,
      rol,
      departamento || null,
      _id.toString(),
    ]);

    console.log("♻️ Usuario actualizado correctamente en Postgres");
  } catch (error) {
    console.error("❌ Error al actualizar usuario en Postgres:", error);
    throw error;
  }
}

module.exports = {
  sincronizarUsuario,
  obtenerUsuarioPorIdMongo,
  actualizarUsuario,
};
