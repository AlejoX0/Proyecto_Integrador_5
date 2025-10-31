// ====================================================
// 🚀 SERVIDOR PRINCIPAL - MICRO SERVICIO DE MUESTRAS
// ====================================================

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const muestrasRoutes = require("./routes/muestrasRoutes");
const pool = require("./db/postgres");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Rutas principales
app.use("/api/muestras", muestrasRoutes);

// Puerto
const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`🧫 Microservicio de Muestras activo en puerto ${PORT}`));

// Comprobación de BD
pool.connect()
  .then(() => console.log("✅ Conectado correctamente a PostgreSQL (Neon)."))
  .catch(err => console.error("❌ Error al conectar a la BD:", err.message));
