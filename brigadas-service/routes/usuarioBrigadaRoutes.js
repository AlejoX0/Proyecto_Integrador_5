// routes/usuarioBrigadaRoutes.js
const express = require("express");
const router = express.Router();
const {
  asignarUsuarioABrigada,
  listarIntegrantesDeBrigada,
  eliminarUsuarioDeBrigada,
} = require("../controllers/usuarioBrigadaController");
const { verificarToken, verificarRolAdmin } = require("../middleware/auth");

// 🔐 Middleware de autenticación
router.use(verificarToken);

// CU4 - Asignar usuario a brigada (solo admin)
router.post("/", verificarRolAdmin(), asignarUsuarioABrigada);

// CU5 - Listar usuarios de una brigada (cualquier usuario autenticado)
router.get("/:id_brigada", (req, res, next) => next(), listarIntegrantesDeBrigada);

// CU6 - Eliminar usuario de brigada (solo admin)
router.delete("/:id_brigada/:id_usuario", verificarRolAdmin(), eliminarUsuarioDeBrigada);

module.exports = router;
