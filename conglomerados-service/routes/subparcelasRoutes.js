// routes/subparcelasRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/subparcelasController');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.use(verificarToken);

// listar subparcelas por conglomerado (todos los roles autenticados)
router.get('/conglomerado/:id_conglomerado', ctrl.listarPorConglomerado);

// detalle subparcela
router.get('/:id', ctrl.detalle);

module.exports = router;
