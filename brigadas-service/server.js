// ====================================================
// SERVICIO DE BRIGADAS - Acceso a PostgreSQL (Neon)
// ====================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Conexión a BD
require("./db/postgres");

// Rutas
const brigadasRoutes = require("./routes/brigadasRoutes");
const herramientasRoutes = require("./routes/herramientasRoutes");
const usuarioBrigadaRoutes = require("./routes/usuarioBrigadaRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "brigadas-service" });
});

// Montar rutas
app.use("/api/brigadas", brigadasRoutes);
app.use("/api/herramientas", herramientasRoutes);
app.use("/api/usuario-brigada", usuarioBrigadaRoutes);

// Manejadores globales de errores
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Brigadas-Service escuchando en puerto ${PORT}`);
});
