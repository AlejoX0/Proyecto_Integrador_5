// services/subparcelasService.js
const pool = require('../db/postgres');

async function listarSubparcelasPorConglomerado(id_conglomerado) {
  const id = Number(id_conglomerado);
  
  // ✅ CAMBIO AQUÍ: Reemplazamos la función de PG por una consulta directa.
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
    FROM 
      subparcela
    WHERE 
      id_conglomerado = $1
    ORDER BY
      id_subparcela ASC;
  `;

  const { rows } = await pool.query(query, [id]);
  return rows;
}

async function obtenerSubparcela(id_subparcela) {
  const { rows } = await pool.query('SELECT * FROM subparcela WHERE id_subparcela = $1', [id_subparcela]);
  return rows[0] || null;
}

module.exports = { listarSubparcelasPorConglomerado, obtenerSubparcela };