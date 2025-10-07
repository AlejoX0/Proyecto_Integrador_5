// routes/conglomeradosRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/conglomeradosController');
const { verificarToken, verificarRol } = require('../middleware/auth');

// todas protegidas
router.use(verificarToken);

// POST manual (admin)
router.post('/', verificarRol(['admin']), ctrl.crearManual);

// POST auto (admin)
router.post('/auto', verificarRol(['admin']), ctrl.crearAuto);

// GET listar (autenticado)
router.get('/', ctrl.listar);

// GET detalle (admin/jefe/botanico/coinvestigador)
router.get('/:id', verificarRol(['admin','jefe','botanico','coinvestigador']), ctrl.detalle);

module.exports = router;
