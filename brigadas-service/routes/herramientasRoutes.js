// routes/herramientasRoutes.js
const express = require("express");
const router = express.Router();
const {
  crearHerramienta,
  listarHerramientas,
  registrarUso,
  obtenerUso,
} = require("../controllers/herramientasController");
const { verificarToken, verificarRolAdmin } = require("../middleware/auth");

// 🔐 Middleware de autenticación
router.use(verificarToken);

// CU7 - Crear herramienta (solo admin)
router.post("/", verificarRolAdmin(), crearHerramienta);

// CU9 - Listar herramientas (cualquier usuario autenticado)
router.get("/", listarHerramientas);

// CU8 - Registrar uso de herramienta (cualquier usuario autenticado)
router.post("/uso", registrarUso);

// CU9 - Consultar uso de herramientas por brigada (cualquier usuario autenticado)
router.get("/uso/:id_brigada", obtenerUso);

module.exports = router;
