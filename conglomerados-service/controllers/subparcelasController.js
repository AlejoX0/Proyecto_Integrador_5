// controllers/subparcelasController.js
const Service = require('../services/subparcelasService');

// Controlador para TODAS las subparcelas
async function listarTodas(req, res) {
  try {
    const rows = await Service.listarTodasSubparcelas();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Controlador para subparcelas POR conglomerado
async function listarPorConglomerado(req, res) {
  try {
    const id = Number(req.params.id_conglomerado);
  	const rows = await Service.listarSubparcelasPorConglomerado(id);
  	res.json(rows);
  } catch (err) {
  	res.status(500).json({ error: err.message });
  }
}

// Controlador para el detalle de UNA subparcela
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

module.exports = { 
  listarTodas, // Exportamos el nuevo controlador
  listarPorConglomerado, 
  detalle 
};