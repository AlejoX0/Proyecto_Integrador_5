const Service = require('../services/conglomeradosService');
const Conglomerado = require('../models/Conglomerado');

// =========================================================
// ✅ Crear Manual
// =========================================================
async function crearManual(req, res) {
  try {
    Conglomerado.validarManual(req.body);
    const result = await Service.crearConglomeradoManual(
      req.body,
      { autoCreateSubparcelas: true }
    );
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// =========================================================
// ✅ Crear Automático
// =========================================================
async function crearAuto(req, res) {
  try {
    const params = req.body;
    const rows = await Service.crearConglomeradosAutomatico(params);
    res.status(201).json({
      message: `${rows.length} conglomerados creados`,
      created: rows
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// =========================================================
// ✅ Listar Conglomerados
// =========================================================
async function listar(req, res) {
  try {
    const rows = await Service.listarConglomerados();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// =========================================================
// ✅ DETALLE — VERSIÓN FINAL CORREGIDA ✅
// =========================================================
// ✅ valida ID
// ✅ evita NaN
// ✅ evita "unknown" en PostgreSQL
// ✅ no toca nada que ya tenías
async function detalle(req, res) {
  try {
    const idString = req.params.id;

    // Validación fuerte sin alterar nada
    if (!idString || idString.trim() === '') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const id = parseInt(idString, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Llamada al servicio
    const data = await Service.obtenerConglomeradoPorId(id);

    if (!data) {
      return res.status(404).json({ error: 'no encontrado' });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// =========================================================
// ✅ EXPORTAR CONTROLLER
// =========================================================
module.exports = {
  crearManual,
  crearAuto,
  listar,
  detalle
};
