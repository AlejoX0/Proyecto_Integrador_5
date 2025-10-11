// routes/conglomeradosRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/conglomeradosController');
const { verificarToken, verificarRolAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// POST manual (solo administrador)
router.post('/', verificarRolAdmin(), ctrl.crearManual);

// POST automático (solo administrador)
router.post('/auto', verificarRolAdmin(), ctrl.crearAuto);

// GET listar (cualquier usuario autenticado)
router.get('/', ctrl.listar);

// GET detalle (roles permitidos: administrador, jefe, botanico, coinvestigador)
router.get('/:id', (req, res, next) => {
  const rolesPermitidos = ['administrador', 'jefe', 'botanico', 'coinvestigador'];
  if (!req.user) return res.status(401).json({ error: 'No autenticado' });

  if (!rolesPermitidos.includes(req.user.rol.toLowerCase())) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
}, ctrl.detalle);

module.exports = router;
