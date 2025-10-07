// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(400).json({ error: 'Formato de token inválido' });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'brigadas_secret_key_IFN_2025');
    req.user = payload; // ej. { id_usuario, nombre, rol }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function verificarRol(rolesPermitidos = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    if (!rolesPermitidos.includes(req.user.rol)) return res.status(403).json({ error: 'Acceso denegado' });
    next();
  };
}

module.exports = { verificarToken, verificarRol };
