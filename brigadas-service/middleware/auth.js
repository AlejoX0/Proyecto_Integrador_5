// middleware/auth.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

/**
 * Middleware para verificar el token JWT enviado en Authorization.
 * Si el token es válido, agrega la información del usuario a req.user.
 */
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token requerido" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(400).json({ error: "Formato de token inválido" });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // ej. { id, rol, correo }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

/**
 * Middleware para verificar que el usuario tenga el rol de administrador.
 */
function verificarRolAdmin() {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });

    if (req.user.rol.toLowerCase() !== "administrador") {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    next();
  };
}

module.exports = { verificarToken, verificarRolAdmin };
