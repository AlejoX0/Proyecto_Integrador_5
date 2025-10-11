// ====================================================
// MIDDLEWARE DE AUTENTICACIÓN Y AUTORIZACIÓN
// ====================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ====================================================
// 🔐 Verificar Token JWT
// ====================================================
const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Token requerido" });
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(400).json({ error: "Formato de token inválido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Error en verificarToken:", err.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// ====================================================
// 🧩 Verificar Rol (autorización por rol)
// ====================================================
const verificarRol = (rolesPermitidos = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ error: "Acceso denegado para este rol" });
    }

    next();
  };
};

module.exports = { verificarToken, verificarRol };
