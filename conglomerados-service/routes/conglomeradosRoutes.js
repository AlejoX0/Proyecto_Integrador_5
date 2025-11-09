// routes/conglomeradosRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/conglomeradosController');
const { verificarToken, verificarRolAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// ✅ Listar todos los conglomerados (GET /api/conglomerados)
router.get('/', ctrl.listar);

// ✅ Obtener detalle por ID (GET /api/conglomerados/:id)
router.get('/:id', ctrl.detalle);

// ✅ Crear manual (solo admin)
router.post('/manual', verificarRolAdmin(), ctrl.crearManual);

// ✅ Crear automático (solo admin)
router.post('/auto', verificarRolAdmin(), ctrl.crearAuto);

module.exports = router;