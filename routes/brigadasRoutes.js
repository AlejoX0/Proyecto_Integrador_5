const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const { obtenerBrigadas, crearBrigada } = require('../services/brigadasService');

// Obtener todas las brigadas (autenticado)
router.get('/', verifyToken, async (req, res) => {
  try {
    const brigadas = await obtenerBrigadas();
    res.json(brigadas);
  } catch (err) {
    console.error('❌ Error al obtener brigadas:', err);
    res.status(500).json({ error: 'Error al obtener brigadas' });
  }
});

// Crear brigada (solo administrador o jefe de brigada)
router.post('/', verifyToken, verifyRole('administrador', 'jefe de brigada'), async (req, res) => {
  try {
    const brigada = await crearBrigada(req.body);
    res.json({ mensaje: '✅ Brigada creada exitosamente', brigada });
  } catch (err) {
    console.error('❌ Error al crear brigada:', err);
    res.status(500).json({ error: 'Error al crear brigada' });
  }
});

module.exports = router;
