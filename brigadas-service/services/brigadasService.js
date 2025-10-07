// ====================================================
// SERVICIO DE BRIGADAS
// ====================================================

const pool = require("../db/postgres");

// 👨‍💼 CU1 - Crear brigada (rol: administrador)
async function crearBrigada(nombre, fecha_asignacion, id_conglomerado, lider) {
  await pool.query(
    "SELECT crear_brigada($1, $2, $3, $4)",
    [nombre, fecha_asignacion, id_conglomerado, lider]
  );
  return { message: "✅ Brigada creada correctamente" };
}

// 👷 CU2 - Asignar conglomerado a brigada (rol: jefe)
async function asignarConglomerado(id_brigada, id_conglomerado) {
  await pool.query("SELECT asignar_conglomerado_a_brigada($1, $2)", [id_brigada, id_conglomerado]);
  return { message: "✅ Conglomerado asignado a brigada" };
}

// 👀 CU3 - Listar brigadas (rol: todos)
async function listarBrigadas() {
  const { rows } = await pool.query("SELECT * FROM listar_brigadas()");
  return rows;
}

module.exports = {
  crearBrigada,
  asignarConglomerado,
  listarBrigadas,
};
