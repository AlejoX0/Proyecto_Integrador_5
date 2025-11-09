// ====================================================
// RUTAS DE AUTENTICACIÓN Y USUARIOS
// ====================================================

const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Importar controladores
const {
  crearPrimerAdmin,
  registrarUsuario,
  loginUsuario,
  actualizarUsuario,
  eliminarUsuario,
  filtrarUsuarios,
  obtenerAuditorias,
} = require("../controllers/authController");

// Importar middlewares
const { verificarToken, verificarRol } = require("../middleware/authMiddleware");

// ====================================================
// 🚨 Crear primer administrador (solo se usa 1 vez)
// ====================================================
router.post("/setup-admin", crearPrimerAdmin);

// ====================================================
// 👤 Registrar usuario (solo administrador)
// ====================================================
router.post("/register", verificarToken, verificarRol(["administrador"]), registrarUsuario);

// ====================================================
// 🔐 Login (todos los usuarios)
// ====================================================
router.post("/login", loginUsuario);

// ====================================================
// ✏ Actualizar usuario (solo administrador)
// ====================================================
router.put("/update/:id", verificarToken, verificarRol(["administrador"]), actualizarUsuario);

// ====================================================
// ❌ Eliminar usuario (solo administrador)
// ====================================================
router.delete("/delete/:id", verificarToken, verificarRol(["administrador"]), eliminarUsuario);

// ====================================================
// 🔍 Filtrar usuarios por departamento/rol (solo administrador)
// ====================================================
router.get("/filter", verificarToken, verificarRol(["administrador"]), filtrarUsuarios);

// ====================================================
// 📜 Ver auditorías (solo administrador)
// ====================================================
router.get("/auditorias", verificarToken, verificarRol(["administrador"]), obtenerAuditorias);

// ====================================================
// 👥 NUEVA RUTA: Listar todos los usuarios (sin contraseñas)
// ====================================================
router.get("/usuarios", verificarToken, async (req, res) => {
  try {
    // ✅ Solo permitir acceso a roles autorizados
    const rolesPermitidos = ["administrador", "jefe de brigada"];
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    // ✅ Retorna todos los usuarios sin el campo password
    const usuarios = await User.find({}, "-password");
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios." });
  }
});

module.exports = router;