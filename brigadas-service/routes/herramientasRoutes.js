// ============================================
// RUTAS: Herramientas y uso de herramientas
// Protegidas por autenticación JWT
// ============================================

const express = require("express");
const router = express.Router();

const {
  crearHerramienta,
  listarHerramientas,
  registrarUso,
  obtenerUso,
} = require("../controllers/herramientasController");

const { verificarToken } = require("../middleware/authMiddleware");

// 🔐 Middleware de autenticación
router.use(verificarToken);

// CU7 - Crear herramienta (solo admin)
router.post("/", crearHerramienta);

// CU9 - Listar herramientas
router.get("/", listarHerramientas);

// CU8 - Registrar uso de herramienta
router.post("/uso", registrarUso);

// CU9 - Consultar uso de herramientas por brigada
router.get("/uso/:id_brigada", obtenerUso);

module.exports = router;
