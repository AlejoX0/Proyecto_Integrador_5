// ====================================================
// SERVICIO DE BRIGADAS - Acceso a la base de datos
// ====================================================

const pool = require("../db/postgres.js");

// ====================================================
// 🔹 Crear una nueva brigada — usa la función SQL
// ====================================================

const crearBrigada = async (departamento, fecha_asignacion, id_conglomerado, lider) => {
  try {
    const query = `
      SELECT crear_brigada($1, $2, $3, $4) AS resultado;
    `;
    const values = [departamento, fecha_asignacion, id_conglomerado, lider];

    const { rows } = await pool.query(query, values);
    console.log("🔥 crear_brigada ejecutada:", rows[0]);

    return rows[0];
  } catch (error) {
    console.error("❌ Error en crearBrigada:", error.message);
    throw error;
  }
};

// ====================================================
// 🔹 Asignar un conglomerado a una brigada — usa función SQL
// ====================================================

const asignarConglomerado = async (id_brigada, id_conglomerado) => {
  try {
    const query = `
      SELECT asignar_conglomerado_a_brigada($1, $2) AS resultado;
    `;
    const values = [id_brigada, id_conglomerado];

    const { rows } = await pool.query(query, values);
    console.log("🔥 asignar_conglomerado_a_brigada ejecutada:", rows[0]);

    return rows[0];
  } catch (error) {
    console.error("❌ Error en asignarConglomerado:", error.message);
    throw error;
  }
};

// ====================================================
// 🔹 Listar todas las brigadas
// ====================================================

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

    return rows;
  } catch (error) {
    console.error("❌ Error en listarBrigadas:", error.message);
    throw error;
  }
};

// ====================================================
// 🔹 Listar brigadas de un líder
// ====================================================

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

    return rows;
  } catch (error) {
    console.error("❌ Error en listarBrigadasPorLider:", error.message);
    throw error;
  }
};

module.exports = {
  crearBrigada,
  asignarConglomerado,
  listarBrigadas,
  listarBrigadasPorLider,
};
