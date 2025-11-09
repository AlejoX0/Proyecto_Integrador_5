// ====================================================
// SERVICIO DE BRIGADAS - Acceso a PostgreSQL (Neon)
// ====================================================

import pool from "../db/postgres.js";

// ====================================================
// 🔹 Crear una brigada
// ====================================================
export const crearBrigada = async (departamento, fecha_asignacion, id_conglomerado, lider) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO brigadas (departamento, fecha_asignacion, id_conglomerado, lider)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [departamento, fecha_asignacion, id_conglomerado || null, lider]
    );

    return result.rows[0];
  } catch (error) {
    console.error("❌ Error al crear brigada:", error.message);
    throw new Error("Error al crear brigada en la base de datos");
  }
};

// ====================================================
// 🔹 Asignar conglomerado a brigada
// ====================================================
export const asignarConglomerado = async (id_brigada, id_conglomerado) => {
  try {
    const result = await pool.query(
      `
      UPDATE brigadas
      SET id_conglomerado = $1
      WHERE id_brigada = $2
      RETURNING *;
      `,
      [id_conglomerado, id_brigada]
    );

    if (result.rowCount === 0) {
      throw new Error("No se encontró la brigada especificada");
    }

    return result.rows[0];
  } catch (error) {
    console.error("❌ Error al asignar conglomerado:", error.message);
    throw new Error("Error al asignar conglomerado a la brigada");
  }
};

// ====================================================
// 🔹 Listar brigadas (para administrador y jefes)
// ====================================================
export const listarBrigadas = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id_brigada,
        b.nombre,
        b.departamento,
        b.fecha_asignacion AS fecha_creacion,
        b.id_conglomerado,
        u.nombre || ' ' || u.apellido AS jefe
      FROM brigadas b
      LEFT JOIN usuarios u ON b.lider = u.id_usuario
      ORDER BY b.id_brigada ASC;
    `);

    console.log(`📋 ${result.rowCount} brigada(s) encontradas.`);
    return result.rows;
  } catch (error) {
    console.error("❌ Error al listar brigadas:", error.message);
    throw new Error("Error interno al listar brigadas");
  }
};