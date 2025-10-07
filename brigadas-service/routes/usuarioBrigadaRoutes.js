// ============================================
// RUTAS: Relación Usuario-Brigada
// ============================================

const express = require("express");
const router = express.Router();

const {
  asignarUsuarioABrigada,
  listarIntegrantesDeBrigada,
  eliminarUsuarioDeBrigada,
} = require("../controllers/usuarioBrigadaController");

const { verificarToken } = require("../middleware/auth");

// 🔐 Middleware de autenticación
router.use(verificarToken);

// CU4 - Asignar usuario a brigada
router.post("/", asignarUsuarioABrigada);

// CU5 - Listar usuarios de una brigada
router.get("/:id_brigada", listarIntegrantesDeBrigada);

// CU6 - Eliminar usuario de brigada
router.delete("/:id_brigada/:id_usuario", eliminarUsuarioDeBrigada);

module.exports = router;
