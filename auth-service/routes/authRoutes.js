// ====================================================
// RUTAS DE AUTENTICACIÓN Y USUARIOS
// ====================================================

const express = require("express");
const router = express.Router();

// Importar controladores
const {
  crearPrimerAdmin,
  registrarUsuario,
  loginUsuario,
  actualizarUsuario,
  eliminarUsuario,
  filtrarUsuarios,
  obtenerAuditorias, // 👈 nuevo
} = require("../controllers/authController");

// Importar middlewares
const { verificarToken, verificarRol } = require("../middleware/authMiddleware");

// 🚨 Crear primer administrador (solo se usa 1 vez)
router.post("/setup-admin", crearPrimerAdmin);

// 👤 Solo el administrador puede registrar nuevos usuarios
router.post("/register", verificarToken, verificarRol(["administrador"]), registrarUsuario);

// 🔐 Todos los usuarios pueden iniciar sesión
router.post("/login", loginUsuario);

// ✏️ Actualizar usuario (solo administrador)
router.put("/update/:id", verificarToken, verificarRol(["administrador"]), actualizarUsuario);

// ❌ Eliminar usuario (solo administrador)
router.delete("/delete/:id", verificarToken, verificarRol(["administrador"]), eliminarUsuario);

// 🔍 Filtrar usuarios por departamento y/o rol (solo administrador)
router.get("/filter", verificarToken, verificarRol(["administrador"]), filtrarUsuarios);

// 📜 Ver historial de auditorías (solo administrador)
router.get("/auditorias", verificarToken, verificarRol(["administrador"]), obtenerAuditorias); // 👈 nuevo

module.exports = router;
