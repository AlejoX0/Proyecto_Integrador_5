// controllers/subparcelasController.js
const Service = require('../services/subparcelasService');

async function listarPorConglomerado(req, res) {
  try {
    const id = Number(req.params.id_conglomerado);
    const rows = await Service.listarSubparcelasPorConglomerado(id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function detalle(req, res) {
  try {
    const id = Number(req.params.id);
    const row = await Service.obtenerSubparcela(id);
    if (!row) return res.status(404).json({ error: 'No encontrado' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listarPorConglomerado, detalle };
