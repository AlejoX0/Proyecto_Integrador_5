// ====================================================
// MIDDLEWARE DE AUTENTICACIÓN Y AUTORIZACIÓN
// ====================================================

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// ✅ Verificar token JWT
function verificarToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}

// ✅ Verificar rol del usuario
function verificarRol(rolesPermitidos = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });

    const { rol } = req.user;
    if (!rolesPermitidos.includes(rol))
      return res.status(403).json({ error: "Acceso denegado para este rol" });

    next();
  };
}

module.exports = { verificarToken, verificarRol };
