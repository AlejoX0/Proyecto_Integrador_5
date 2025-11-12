// routes/subparcelasRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/subparcelasController');
const { verificarToken, verificarRol } = require('../middleware/auth');

// Aplica el middleware de autenticación a TODAS las rutas de subparcelas
router.use(verificarToken);

// --- Definición de Rutas ---

// ✅ NUEVA RUTA: GET /api/subparcelas
// Obtiene TODAS las subparcelas. 
router.get('/', ctrl.listarTodas);

// GET /api/subparcelas/conglomerado/:id_conglomerado
// Obtiene subparcelas POR conglomerado
router.get('/conglomerado/:id_conglomerado', ctrl.listarPorConglomerado);

// GET /api/subparcelas/:id
// Obtiene el detalle de UNA subparcela
router.get('/:id', ctrl.detalle);

module.exports = router;