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

// 🔐 Middleware global de autenticación
router.use(verificarToken);

// CU7 - Crear herramienta (solo admin)
router.post("/", verificarRolAdmin(), crearHerramienta);

// CU9 - Listar herramientas (todos los usuarios autenticados)
router.get("/", listarHerramientas);

// CU8 - Registrar uso de herramienta (brigadistas o jefes)
router.post("/uso", registrarUso);

// CU9 - Consultar uso de herramientas por brigada
router.get("/uso/:id_brigada", obtenerUso);

module.exports = router;
