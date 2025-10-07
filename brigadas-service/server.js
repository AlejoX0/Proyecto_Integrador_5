// ====================================================
// SERVIDOR PRINCIPAL - brigadas-service
// ====================================================

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const pool = require("./db/postgres");
const { verificarToken } = require("./middleware/auth"); // ✅ Importamos solo la función necesaria

// Rutas
const brigadasRoutes = require("./routes/brigadasRoutes");
const herramientasRoutes = require("./routes/herramientasRoutes");
const usuarioBrigadaRoutes = require("./routes/usuarioBrigadaRoutes");

// Configuración
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Verifica conexión a la base de datos
pool.connect()
  .then(() => console.log("✅ Conexión establecida con PostgreSQL (Neon)."))
  .catch((err) => console.error("❌ Error de conexión:", err.message));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 API de Brigadas funcionando correctamente");
});

// ====================================================
// RUTAS PROTEGIDAS CON JWT
// ====================================================
app.use("/api/brigadas", verificarToken, brigadasRoutes);
app.use("/api/herramientas", verificarToken, herramientasRoutes);
app.use("/api/usuarios-brigadas", verificarToken, usuarioBrigadaRoutes);

// ====================================================
// PUERTO DE ESCUCHA
// ====================================================
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
