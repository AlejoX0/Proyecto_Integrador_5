// ====================================================
// MIDDLEWARE DE AUTENTICACIÓN Y AUTORIZACIÓN
// ====================================================

const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ Verificar token JWT
function verificarToken(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "Token requerido" });

  const [bearer, token] = header.split(" ");
  if (bearer !== "Bearer" || !token)
    return res.status(400).json({ error: "Formato de token inválido" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

// ✅ Verificar rol permitido
function verificarRol(rolesPermitidos = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });

    const rolUsuario = req.user.rol.toLowerCase();
    if (!rolesPermitidos.includes(rolUsuario))
      return res.status(403).json({
        error: "Acceso denegado",
        rolActual: rolUsuario,
        rolesPermitidos,
      });

    next();
  };
}

module.exports = { verificarToken, verificarRol };
