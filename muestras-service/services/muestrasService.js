const pool = require("../db/postgres");

// -------------------------
// MUESTRAS
// -------------------------
async function crearMuestra(datos) {
  const { id_subparcela, tipo, cantidad, codigo_envio, estado_envio, fecha_recoleccion, responsable } = datos;
  await pool.query("SELECT crear_muestra($1,$2,$3,$4,$5,$6,$7)", [
    id_subparcela, tipo, cantidad, codigo_envio, estado_envio, fecha_recoleccion, responsable
  ]);
  return { message: "✅ Muestra registrada correctamente" };
}

async function listarMuestras() {
  const { rows } = await pool.query("SELECT * FROM listar_muestras()");
  return rows;
}

// -------------------------
// SUBTIPOS DE MUESTRAS
// -------------------------
async function crearMuestraBotanica(datos) {
  const { id_muestra, id_especie, condicion, id_herbario, observaciones } = datos;
  await pool.query("SELECT crear_muestra_botanica($1,$2,$3,$4,$5)", [
    id_muestra, id_especie, condicion, id_herbario, observaciones
  ]);
  return { message: "🌿 Muestra botánica registrada correctamente" };
}

async function crearMuestraSuelo(datos) {
  const { id_muestra, profundidad_inicio, profundidad_fin, peso_muestra, codigo_laboratorio, condiciones_transporte, id_laboratorio } = datos;
  await pool.query("SELECT crear_muestra_suelo($1,$2,$3,$4,$5,$6,$7)", [
    id_muestra, profundidad_inicio, profundidad_fin, peso_muestra, codigo_laboratorio, condiciones_transporte, id_laboratorio
  ]);
  return { message: "🧪 Muestra de suelo registrada correctamente" };
}

async function crearMuestraDetrito(datos) {
  const { id_muestra, diametro, longitud, peso, estado_descomposicion, uso } = datos;
  await pool.query("SELECT crear_muestra_detrito($1,$2,$3,$4,$5,$6)", [
    id_muestra, diametro, longitud, peso, estado_descomposicion, uso
  ]);
  return { message: "🍂 Muestra de detrito registrada correctamente" };
}

// -------------------------
// ESTADOS DE ENVÍO
// -------------------------
async function actualizarEnvio(id_muestra, codigo_herbario) {
  await pool.query("SELECT actualizar_envio($1,$2)", [id_muestra, codigo_herbario]);
  return { message: "📦 Envío actualizado correctamente" };
}

async function registrarRecepcion(id_muestra) {
  await pool.query("SELECT registrar_recepcion($1)", [id_muestra]);
  return { message: "📬 Recepción registrada correctamente" };
}

// -------------------------
// HERBARIOS (ADMIN)
// -------------------------
async function listarHerbarios() {
  const { rows } = await pool.query("SELECT * FROM listar_herbarios()");
  return rows;
}

async function crearHerbario(datos) {
  const { sigla, nombre, institucion, region, ubicacion, correo } = datos;
  await pool.query("SELECT crear_herbario($1,$2,$3,$4,$5,$6)", [sigla, nombre, institucion, region, ubicacion, correo]);
  return { message: "🌿 Herbario creado correctamente" };
}

async function actualizarHerbario(id_herbario, datos) {
  const { sigla, nombre, institucion, region, ubicacion, correo, estado } = datos;
  await pool.query("SELECT actualizar_herbario($1,$2,$3,$4,$5,$6,$7,$8)", [id_herbario, sigla, nombre, institucion, region, ubicacion, correo, estado]);
  return { message: "🌱 Herbario actualizado correctamente" };
}

async function eliminarHerbario(id_herbario) {
  await pool.query("SELECT eliminar_herbario($1)", [id_herbario]);
  return { message: "🗑️ Herbario eliminado correctamente" };
}

// -------------------------
// LABORATORIOS (ADMIN)
// -------------------------
async function listarLaboratorios() {
  const { rows } = await pool.query("SELECT * FROM listar_laboratorios()");
  return rows;
}

async function crearLaboratorio(datos) {
  const { sigla, nombre, institucion, region, ubicacion, correo } = datos;
  await pool.query("SELECT crear_laboratorio($1,$2,$3,$4,$5,$6)", [sigla, nombre, institucion, region, ubicacion, correo]);
  return { message: "🧬 Laboratorio creado correctamente" };
}

async function actualizarLaboratorio(id_laboratorio, datos) {
  const { sigla, nombre, institucion, region, ubicacion, correo, estado } = datos;
  await pool.query("SELECT actualizar_laboratorio($1,$2,$3,$4,$5,$6,$7,$8)", [id_laboratorio, sigla, nombre, institucion, region, ubicacion, correo, estado]);
  return { message: "🧫 Laboratorio actualizado correctamente" };
}

async function eliminarLaboratorio(id_laboratorio) {
  await pool.query("SELECT eliminar_laboratorio($1)", [id_laboratorio]);
  return { message: "🗑️ Laboratorio eliminado correctamente" };
}

module.exports = {
  crearMuestra,
  listarMuestras,
  crearMuestraBotanica,
  crearMuestraSuelo,
  crearMuestraDetrito,
  actualizarEnvio,
  registrarRecepcion,
  listarHerbarios,
  crearHerbario,
  actualizarHerbario,
  eliminarHerbario,
  listarLaboratorios,
  crearLaboratorio,
  actualizarLaboratorio,
  eliminarLaboratorio
};
