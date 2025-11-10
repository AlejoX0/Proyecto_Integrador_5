// ====================================================
// SERVICIO DE BRIGADAS - Acceso a la base de datos
// ====================================================

// Corregido: Se usa 'require' y la ruta '../' (para subir de 'services' a 'db')
const pool = require("../db/postgres.js");

// ====================================================
// 🔹 Crear una nueva brigada
// ====================================================

// Corregido: Se quita 'export'
const crearBrigada = async (departamento, fecha_asignacion, id_conglomerado, lider) => {
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

// Corregido: Se quita 'export'
const asignarConglomerado = async (id_brigada, id_conglomerado) => {
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

// Corregido: Se quita 'export'
const listarBrigadas = async () => {
  try {
    const query = `
      SELECT 
        b.id_brigada,
        b.departamento,
        b.fecha_asignacion,
        b.id_conglomerado,
        b.lider,
        u.nombre AS nombre_lider,
        u.apellido AS apellido_lider
      FROM brigada b
      LEFT JOIN usuario u ON u.id_usuario = b.lider
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

// Corregido: Se quita 'export'
const listarBrigadasPorLider = async (liderId) => {
  try {
    const query = `
      SELECT 
        b.id_brigada,
        b.departamento,
        b.fecha_asignacion,
        b.id_conglomerado,
        b.lider,
        u.nombre AS nombre_lider,
        u.apellido AS apellido_lider
      FROM brigada b
      LEFT JOIN usuario u ON u.id_usuario = b.lider
      WHERE b.lider = $1
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

// Corregido: Se añade 'module.exports' al final
module.exports = {
  crearBrigada,
  asignarConglomerado,
  listarBrigadas,
  listarBrigadasPorLider,
};