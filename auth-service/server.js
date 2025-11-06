// ====================================================
// SERVIDOR PRINCIPAL - MICROSERVICIO DE AUTENTICACIÓN
// ====================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

// Rutas
const authRoutes = require("./routes/authRoutes");

// Inicializar app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.json({ strict: false }));
// Rutas principales
app.use("/api/auth", authRoutes);

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/proyecto_integrador_auth";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Conectado a MongoDB (Auth Service)");

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Auth Service corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar MongoDB:", err.message);
  });
