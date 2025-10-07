// services/subparcelasService.js
const pool = require('../db/postgres');

async function listarSubparcelasPorConglomerado(id_conglomerado) {
  const { rows } = await pool.query('SELECT * FROM listar_subparcelas_por_conglomerado($1)', [id_conglomerado]);
  return rows;
}

async function obtenerSubparcela(id_subparcela) {
  const { rows } = await pool.query('SELECT * FROM subparcela WHERE id_subparcela = $1', [id_subparcela]);
  return rows[0] || null;
}

module.exports = { listarSubparcelasPorConglomerado, obtenerSubparcela };
