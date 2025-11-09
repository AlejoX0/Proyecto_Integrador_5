// ====================================================
// SERVICIO DE BRIGADAS - Acceso a la base de datos
// ====================================================

import pool from "../db/postgres.js";

// ====================================================
// 🔹 Crear una nueva brigada
// ====================================================
export const crearBrigada = async (departamento, fecha_asignacion, id_conglomerado, lider) => {
  try {
    const query = `
      INSERT INTO brigada (departamento, fecha_asignacion, id_conglomerado, lider)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [departamento, fecha_asignacion, id_conglomerado, lider];
    const { rows } = await pool.query(query, values);
    console.log("✅ Brigada creada:", rows[0]);
    return rows[0];
  } catch (error) {
    console.error("❌ Error en crearBrigada:", error.message);
    throw error;
  }
};

// ====================================================
// 🔹 Asignar un conglomerado a una brigada
// ====================================================
export const asignarConglomerado = async (id_brigada, id_conglomerado) => {
  try {
    const query = `
      UPDATE brigada
      SET id_conglomerado = $1
      WHERE id_brigada = $2
      RETURNING *;
    `;
    const values = [id_conglomerado, id_brigada];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      console.warn(`⚠ No se encontró la brigada con ID ${id_brigada}`);
      return null;
    }

    console.log(`✅ Conglomerado ${id_conglomerado} asignado a brigada ${id_brigada}`);
    return rows[0];
  } catch (error) {
    console.error("❌ Error en asignarConglomerado:", error.message);
    throw error;
  }
};

// ====================================================
// 🔹 Listar todas las brigadas (solo para administrador)
// ====================================================
export const listarBrigadas = async () => {
  try {
    const query = `
      SELECT 
        b.id_brigada,
        b.departamento,
        b.fecha_asignacion,
        b.id_conglomerado,
        b.lider,
        u.nombre AS nombre_lider
      FROM brigada b
      LEFT JOIN usuario u ON CAST(u.nro_documento AS TEXT) = CAST(b.lider AS TEXT)
      ORDER BY b.id_brigada ASC;
    `;
    const { rows } = await pool.query(query);
    console.log("✅ Brigadas encontradas:", rows.length);
    return rows;
  } catch (error) {
    console.error("❌ Error en listarBrigadas:", error.message);
    throw error;
  }
};

// ====================================================
// 🔹 Listar brigadas asignadas a un líder específico
// ====================================================
export const listarBrigadasPorLider = async (liderId) => {
  try {
    const query = `
      SELECT 
        b.id_brigada,
        b.departamento,
        b.fecha_asignacion,
        b.id_conglomerado,
        b.lider,
        u.nombre AS nombre_lider
      FROM brigada b
      LEFT JOIN usuario u ON CAST(u.nro_documento AS TEXT) = CAST(b.lider AS TEXT)
      WHERE CAST(b.lider AS TEXT) = $1
      ORDER BY b.id_brigada ASC;
    `;
    const { rows } = await pool.query(query, [liderId]);
    console.log(`✅ Brigadas del líder ${liderId}:`, rows.length);
    return rows;
  } catch (error) {
    console.error("❌ Error en listarBrigadasPorLider:", error.message);
    throw error;
  }
};