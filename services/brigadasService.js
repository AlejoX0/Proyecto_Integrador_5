// services/brigadasService.js
const db = require('../db/postgres');

async function createBrigada({ nombre, fecha_asignacion, id_conglomerado, lider_nro_documento }) {
  const q = `INSERT INTO brigada (nombre, fecha_asignacion, id_conglomerado, lider_nro_documento)
             VALUES ($1,$2,$3,$4) RETURNING *`;
  const values = [nombre, fecha_asignacion || null, id_conglomerado || null, lider_nro_documento || null];
  const res = await db.query(q, values);
  return res.rows[0];
}

async function getAllBrigadas() {
  const res = await db.query('SELECT * FROM brigada ORDER BY id_brigada DESC');
  return res.rows;
}

module.exports = { createBrigada, getAllBrigadas };
