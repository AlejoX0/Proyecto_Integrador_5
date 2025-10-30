const pool = require("../db/postgres");

// 🌳 Crear individuo (Auxiliar o Admin)
async function crearIndividuo(id_subparcela, id_especie, diametro, altura, estado, observaciones) {
  await pool.query("SELECT crear_individuo($1, $2, $3, $4, $5, $6)", [
    id_subparcela,
    id_especie,
    diametro,
    altura,
    estado,
    observaciones,
  ]);
  return { message: "✅ Individuo registrado correctamente" };
}

// 🧾 Consultar individuos (todos los roles)
async function listarIndividuosPorSubparcela(id_subparcela) {
  try {
    const { rows } = await pool.query("SELECT * FROM listar_individuos_por_subparcela($1)", [id_subparcela]);
    return rows;
  } catch (err) {
    console.error("❌ Error en listarIndividuosPorSubparcela:", err.message);
    throw err;
  }
}


// ✏️ Actualizar individuo (Auxiliar, Jefe de Brigada o Admin)
async function actualizarIndividuo(id_individuo, campos) {
  const { id_especie, diametro, altura, estado, observaciones } = campos;
  await pool.query(
    "UPDATE individuo SET id_especie=$1, diametro=$2, altura=$3, estado=$4, observaciones=$5 WHERE id_individuo=$6",
    [id_especie, diametro, altura, estado, observaciones, id_individuo]
  );
  return { message: "✅ Individuo actualizado correctamente" };
}

// ❌ Eliminar individuo (solo Admin)
async function eliminarIndividuo(id_individuo) {
  await pool.query("DELETE FROM individuo WHERE id_individuo=$1", [id_individuo]);
  return { message: "🗑️ Individuo eliminado correctamente" };
}

module.exports = {
  crearIndividuo,
  listarIndividuosPorSubparcela,
  actualizarIndividuo,
  eliminarIndividuo,
};
