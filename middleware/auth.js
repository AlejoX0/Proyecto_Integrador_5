const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Verificar token JWT
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(400).json({ error: 'Formato de token inválido' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'proyectoIntegrador5');
    const usuario = await Usuario.findById(decoded.id).select('-password');

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    req.user = usuario;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Verificar rol permitido
const verifyRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        error: 'Acceso denegado: rol no autorizado',
        rolActual: req.user.rol,
        rolesPermitidos
      });
    }

    next();
  };
};

module.exports = { verifyToken, verifyRole };
