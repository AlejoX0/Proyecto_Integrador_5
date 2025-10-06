// ====================================================
// SERVIDOR PRINCIPAL - MICROSERVICIO DE BRIGADAS
// ====================================================

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Rutas
import brigadasRoutes from "./routes/brigadasRoutes.js";
import usuarioBrigadaRoutes from "./routes/usuarioBrigadaRoutes.js";
import herramientasRoutes from "./routes/herramientasRoutes.js";

dotenv.config();
const app = express();

// ==========================
// CONFIGURACIÓN GENERAL
// ==========================
app.use(cors());
app.use(express.json());

// ==========================
// RUTAS DEL MICROSERVICIO
// ==========================
app.use("/api/brigadas", brigadasRoutes);
app.use("/api/usuario-brigada", usuarioBrigadaRoutes);
app.use("/api/herramientas", herramientasRoutes);

// ==========================
// SERVIDOR
// ==========================
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🚀 Microservicio de Brigadas activo en el puerto ${PORT}`);
});
