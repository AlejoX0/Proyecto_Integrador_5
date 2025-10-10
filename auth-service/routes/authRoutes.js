// ====================================================
// RUTAS DE AUTENTICACIÓN Y USUARIOS
// ====================================================

const express = require("express");
const router = express.Router();
const { registrarUsuario, loginUsuario } = require("../controllers/authController");
const { verificarToken, verificarRol } = require("../middleware/authMiddleware");

// 👤 Solo el administrador puede registrar usuarios
router.post("/register", verificarToken, verificarRol(["administrador"]), registrarUsuario);

// 🔐 Todos los usuarios pueden iniciar sesión
router.post("/login", loginUsuario);

module.exports = router;
