// services/subparcelasService.js
const pool = require('../db/postgres');

/**
 * Obtiene TODAS las subparcelas de la base de datos.
 */
async function listarTodasSubparcelas() {
  const query = `
    SELECT 
      id_subparcela,
      id_conglomerado,
      categoria,
      radio,
      area,
      centro_lat,
      centro_lon,
      centro_lng
    FROM subparcela
    ORDER BY id_conglomerado ASC, id_subparcela ASC;
  `;
  const { rows } = await pool.query(query);
  return rows;
}

/**
 * Obtiene las subparcelas filtradas por un id_conglomerado específico.
 */
async function listarSubparcelasPorConglomerado(id_conglomerado) {
  const id = Number(id_conglomerado); 
  const query = `
    SELECT 
      id_subparcela,
      id_conglomerado,
      categoria,
      radio,
      area,
      centro_lat,
      centro_lon,
      centro_lng
    FROM subparcela
    WHERE id_conglomerado = $1
    ORDER BY id_subparcela ASC;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows;
}

/**
 * Obtiene una subparcela específica por su ID.
 */
async function obtenerSubparcela(id_subparcela) {
  const { rows } = await pool.query('SELECT * FROM subparcela WHERE id_subparcela = $1', [id_subparcela]);
  return rows[0] || null;
}

module.exports = { 
  listarTodasSubparcelas,
  listarSubparcelasPorConglomerado, 
  obtenerSubparcela 
};