// ====================================================
// MIDDLEWARE DE AUTENTICACIÓN Y AUTORIZACIÓN
// ====================================================
// Protege rutas según el rol del usuario.
// Roles posibles: administrador, jefe, auxiliar, botanico

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// ✅ Verificar token JWT
export function verificarToken(req, res, next) {
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
export function verificarRol(rolesPermitidos = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });

    const { rol } = req.user;
    if (!rolesPermitidos.includes(rol))
      return res.status(403).json({ error: "Acceso denegado para este rol" });

    next();
  };
}
