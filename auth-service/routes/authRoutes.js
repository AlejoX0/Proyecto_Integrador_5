// ====================================================
// RUTAS DE AUTENTICACIÓN Y USUARIOS
// ====================================================

const express = require("express");
const router = express.Router();

// Importar controladores
const { crearPrimerAdmin, registrarUsuario, loginUsuario } = require("../controllers/authController");

// Importar middlewares
const { verificarToken, verificarRol } = require("../middleware/authMiddleware");

// 🚨 Crear primer administrador (solo se usa 1 vez)
router.post("/setup-admin", crearPrimerAdmin);

// 👤 Solo el administrador puede registrar nuevos usuarios
router.post("/register", verificarToken, verificarRol(["administrador"]), registrarUsuario);

// 🔐 Todos los usuarios pueden iniciar sesión
router.post("/login", loginUsuario);

module.exports = router;
