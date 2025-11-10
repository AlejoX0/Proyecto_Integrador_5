// ====================================================
// SERVICIO DE BRIGADAS - Acceso a PostgreSQL (Neon)
// ====================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Conexión a BD (inicializa pool y autocarga funciones SQL)
require("./db/postgres");

// Rutas
const brigadasRoutes = require("./routes/brigadasRoutes");
const herramientasRoutes = require("./routes/herramientasRoutes");
const usuarioBrigadaRoutes = require("./routes/usuarioBrigadaRoutes");

// App
const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck simple para monitoreo
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "brigadas-service" });
});

// Montar rutas con prefijo
app.use("/api/brigadas", brigadasRoutes);
app.use("/api/herramientas", herramientasRoutes);
app.use("/api/usuario-brigada", usuarioBrigadaRoutes);

// Manejadores globales de errores no controlados para evitar caída del proceso
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Brigadas-Service escuchando en puerto ${PORT}`);
});

// ====================================================
// 🔹 Crear una brigada
// ====================================================
const crearBrigada = async (departamento, fecha_asignacion, id_conglomerado, lider) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO brigadas (departamento, fecha_asignacion, id_conglomerado, lider)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [departamento, fecha_asignacion, id_conglomerado || null, lider]
    );

    return result.rows[0];
  } catch (error) {
    console.error("❌ Error al crear brigada:", error.message);
    throw new Error("Error al crear brigada en la base de datos");
  }
};

// ====================================================
// 🔹 Asignar conglomerado a brigada
// ====================================================
const asignarConglomerado = async (id_brigada, id_conglomerado) => {
  try {
    const result = await pool.query(
      `
      UPDATE brigadas
      SET id_conglomerado = $1
      WHERE id_brigada = $2
      RETURNING *;
      `,
      [id_conglomerado, id_brigada]
    );

    if (result.rowCount === 0) {
      throw new Error("No se encontró la brigada especificada");
    }

    return result.rows[0];
  } catch (error) {
    console.error("❌ Error al asignar conglomerado:", error.message);
    throw new Error("Error al asignar conglomerado a la brigada");
  }
};

// ====================================================
// 🔹 Listar brigadas
// ====================================================
const listarBrigadas = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id_brigada,
        b.nombre,
        b.departamento,
        b.fecha_asignacion AS fecha_creacion,
        b.id_conglomerado,
        u.nombre || ' ' || u.apellido AS jefe
      FROM brigadas b
      LEFT JOIN usuarios u ON b.lider = u.id_usuario
      ORDER BY b.id_brigada ASC;
    `);

    console.log(`📋 ${result.rowCount} brigada(s) encontradas.`);
    return result.rows;
  } catch (error) {
    console.error("❌ Error al listar brigadas:", error.message);
    throw new Error("Error interno al listar brigadas");
  }
};

module.exports = {
  crearBrigada,
  asignarConglomerado,
  listarBrigadas
};
