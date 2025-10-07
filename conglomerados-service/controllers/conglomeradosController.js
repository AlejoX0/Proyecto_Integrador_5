// controllers/conglomeradosController.js
const Service = require('../services/conglomeradosService');
const Conglomerado = require('../models/Conglomerado');

async function crearManual(req, res) {
  try {
    // solo admin (middleware en route valida rol)
    Conglomerado.validarManual(req.body);
    const result = await Service.crearConglomeradoManual(req.body, { autoCreateSubparcelas: true });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function crearAuto(req, res) {
  try {
    const params = req.body;
    const rows = await Service.crearConglomeradosAutomatico(params);
    res.status(201).json({ message: `${rows.length} conglomerados creados`, created: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function listar(req, res) {
  try {
    const rows = await Service.listarConglomerados();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function detalle(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await Service.obtenerConglomeradoPorId(id);
    if (!data) return res.status(404).json({ error: 'no encontrado' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { crearManual, crearAuto, listar, detalle };
