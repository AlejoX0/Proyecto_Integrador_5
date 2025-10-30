const pool = require("../db/postgres");

// 🌿 Crear especie (Botánico o Admin)
async function crearEspecie(nombre_cientifico, nombre_comun, estado_conservacion, uso) {
  await pool.query("SELECT crear_especie($1, $2, $3, $4)", [
    nombre_cientifico,
    nombre_comun,
    estado_conservacion,
    uso,
  ]);
  return { message: "✅ Especie registrada correctamente" };
}

// 📖 Consultar todas las especies
async function listarEspecies() {
  const { rows } = await pool.query("SELECT * FROM listar_especies()");
  return rows;
}

// ✏️ Actualizar especie (Botánico, Coinvestigador o Admin)
async function actualizarEspecie(id_especie, campos, rol) {
  const { nombre_cientifico, nombre_comun, estado_conservacion, uso } = campos;

  if (rol === "coinvestigador") {
    // Solo puede sugerir cambio en nombre común
    await pool.query("UPDATE especie SET nombre_comun=$1 WHERE id_especie=$2", [
      nombre_comun,
      id_especie,
    ]);
  } else {
    // Botánico o Admin pueden modificar todo
    await pool.query(
      "UPDATE especie SET nombre_cientifico=$1, nombre_comun=$2, estado_conservacion=$3, uso=$4 WHERE id_especie=$5",
      [nombre_cientifico, nombre_comun, estado_conservacion, uso, id_especie]
    );
  }

  return { message: "✅ Especie actualizada correctamente" };
}

// ❌ Eliminar especie (solo Admin)
async function eliminarEspecie(id_especie) {
  await pool.query("DELETE FROM especie WHERE id_especie=$1", [id_especie]);
  return { message: "🗑️ Especie eliminada correctamente" };
}

module.exports = {
  crearEspecie,
  listarEspecies,
  actualizarEspecie,
  eliminarEspecie,
};
