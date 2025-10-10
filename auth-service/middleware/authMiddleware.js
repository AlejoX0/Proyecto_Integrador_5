const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) return res.status(400).json({ error: 'Formato de token inválido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const verifyRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Usuario no autenticado' });
    if (!rolesPermitidos.includes(req.user.rol))
      return res.status(403).json({ error: 'Acceso denegado para este rol' });
    next();
  };
};

module.exports = { verifyToken, verifyRole };
