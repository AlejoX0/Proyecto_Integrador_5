// controllers/muestrasController.js
// ====================================================
// 🌿 CONTROLADOR DE MUESTRAS (General, Botánica, Suelo, Detrito)
// ====================================================

const {
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
} = require("../services/muestrasService");

// --------------------
// MUESTRAS
// --------------------
async function postMuestra(req, res) {
  try {
    // Rol: auxiliar de campo o administrador
    const rol = (req.user && req.user.rol) ? req.user.rol.toLowerCase() : null;
    if (!rol || !["auxiliar de campo", "administrador"].includes(rol)) {
      return res.status(403).json({ error: "Acceso denegado: solo auxiliar de campo o administrador" });
    }

    const result = await crearMuestra(req.body);
    res.json(result);
  } catch (err) {
    console.error("❌ Error al crear muestra:", err);
    res.status(500).json({ error: "Error al crear muestra" });
  }
}

async function getMuestras(req, res) {
  try {
    // Rol: jefe de brigada o administrador (puedes ajustar)
    const rol = (req.user && req.user.rol) ? req.user.rol.toLowerCase() : null;
    if (!rol || !["jefe de brigada", "administrador", "botánico"].includes(rol)) {
      return res.status(403).json({ error: "Acceso denegado: rol no autorizado" });
    }

    const data = await listarMuestras();
    res.json(data);
  } catch (err) {
    console.error("❌ Error al listar muestras:", err);
    res.status(500).json({ error: "Error al obtener muestras" });
  }
}

// --------------------
// SUBTIPOS
// --------------------
async function postMuestraBotanica(req, res) {
  try {
    const rol = (req.user && req.user.rol) ? req.user.rol.toLowerCase() : null;
    if (!rol || !["botanico", "coinvestigador", "administrador"].includes(rol)) {
      return res.status(403).json({ error: "Acceso denegado: solo botánico, coinvestigador o administrador" });
    }

    const result = await crearMuestraBotanica(req.body);
    res.json(result);
  } catch (err) {
    console.error("❌ Error detallado al registrar muestra botánica:", err);
    // devolver el mensaje real si es un error de BD (opcional para debug)
    return res.status(500).json({ error: "Error al registrar muestra botánica", detail: err.message });
  }
}

async function postMuestraSuelo(req, res) {
  try {
    const rol = (req.user && req.user.rol) ? req.user.rol.toLowerCase() : null;
    if (!rol || !["auxiliar de campo", "jefe de brigada", "administrador"].includes(rol)) {
      return res.status(403).json({ error: "Acceso denegado: solo auxiliar, jefe o admin" });
    }

    const result = await crearMuestraSuelo(req.body);
    res.json(result);
  } catch (err) {
    console.error("❌ Error al registrar muestra de suelo:", err);
    return res.status(500).json({ error: "Error al registrar muestra de suelo", detail: err.message });
  }
}

async function postMuestraDetrito(req, res) {
  try {
    const rol = (req.user && req.user.rol) ? req.user.rol.toLowerCase() : null;
    if (!rol || !["auxiliar de campo", "jefe de brigada", "administrador"].includes(rol)) {
      return res.status(403).json({ error: "Acceso denegado: solo auxiliar, jefe o admin" });
    }

    const result = await crearMuestraDetrito(req.body);
    res.json(result);
  } catch (err) {
    console.error("❌ Error al registrar muestra de detrito:", err);
    return res.status(500).json({ error: "Error al registrar muestra de detrito", detail: err.message });
  }
}

// --------------------
// ENVÍO Y RECEPCIÓN
// --------------------
async function putEnvio(req, res) {
  try {
    const rol = (req.user && req.user.rol) ? req.user.rol.toLowerCase() : null;
    if (!rol || !["jefe de brigada", "administrador"].includes(rol)) {
      return res.status(403).json({ error: "Acceso denegado: solo jefe o admin" });
    }

    const { id } = req.params;
    const { codigo_herbario } = req.body;
    const result = await actualizarEnvio(id, codigo_herbario);
    res.json(result);
  } catch (err) {
    console.error("❌ Error al actualizar envío:", err);
    res.status(500).json({ error: "Error al actualizar envío", detail: err.message });
  }
}

async function putRecepcion(req, res) {
  try {
    const rol = (req.user && req.user.rol) ? req.user.rol.toLowerCase() : null;
    if (!rol || !["jefe de brigada", "administrador"].includes(rol)) {
      return res.status(403).json({ error: "Acceso denegado: solo jefe o admin" });
    }

    const { id } = req.params;
    const result = await registrarRecepcion(id);
    res.json(result);
  } catch (err) {
    console.error("❌ Error al registrar recepción:", err);
    res.status(500).json({ error: "Error al registrar recepción", detail: err.message });
  }
}

// --------------------
// HERBARIOS (ADMIN)
// --------------------
async function getHerbarios(req, res) {
  try {
    const data = await listarHerbarios();
    res.json(data);
  } catch (err) {
    console.error("❌ Error al obtener herbarios:", err);
    res.status(500).json({ error: "Error al obtener herbarios", detail: err.message });
  }
}

async function postHerbario(req, res) {
  try {
    const rol = (req.user && req.user.rol) ? req.user.rol.toLowerCase() : null;
    if (!rol || rol !== "administrador") return res.status(403).json({ error: "Acceso denegado: solo admin" });

    const result = await crearHerbario(req.body);
    res.json(result);
  } catch (err) {
    console.error("❌ Error al crear herbario:", err);
    res.status(500).json({ error: "Error al crear herbario", detail: err.message });
  }
}

async function putHerbario(req, res) {
  try {
    const rol = (req.user && req.user.rol) ? req.user.rol.toLowerCase() : null;
    if (!rol || rol !== "administrador") return res.status(403).json({ error: "Acceso denegado: solo admin" });

    const { id } = req.params;
    const result = await actualizarHerbario(id, req.body);
    res.json(result);
  } catch (err) {
    console.error("❌ Error al actualizar herbario:", err);
    res.status(500).json({ error: "Error al actualizar herbario", detail: err.message });
  }
}

async function deleteHerbario(req, res) {
  try {
    const rol = (req.user && req.user.rol) ? req.user.rol.toLowerCase() : null;
    if (!rol || rol !== "administrador") return res.status(403).json({ error: "Acceso denegado: solo admin" });

    const { id } = req.params;
    const result = await eliminarHerbario(id);
    res.json(result);
  } catch (err) {
    console.error("❌ Error al eliminar herbario:", err);
    res.status(500).json({ error: "Error al eliminar herbario", detail: err.message });
  }
}

// --------------------
// LABORATORIOS (ADMIN)
// --------------------
async function getLaboratorios(req, res) {
  try {
    const data = await listarLaboratorios();
    res.json(data);
  } catch (err) {
    console.error("❌ Error al obtener laboratorios:", err);
    res.status(500).json({ error: "Error al obtener laboratorios", detail: err.message });
  }
}

async function postLaboratorio(req, res) {
  try {
    const rol = (req.user && req.user.rol) ? req.user.rol.toLowerCase() : null;
    if (!rol || rol !== "administrador") return res.status(403).json({ error: "Acceso denegado: solo admin" });

    const result = await crearLaboratorio(req.body);
    res.json(result);
  } catch (err) {
    console.error("❌ Error al crear laboratorio:", err);
    res.status(500).json({ error: "Error al crear laboratorio", detail: err.message });
  }
}

async function putLaboratorio(req, res) {
  try {
    const rol = (req.user && req.user.rol) ? req.user.rol.toLowerCase() : null;
    if (!rol || rol !== "administrador") return res.status(403).json({ error: "Acceso denegado: solo admin" });

    const { id } = req.params;
    const result = await actualizarLaboratorio(id, req.body);
    res.json(result);
  } catch (err) {
    console.error("❌ Error al actualizar laboratorio:", err);
    res.status(500).json({ error: "Error al actualizar laboratorio", detail: err.message });
  }
}

async function deleteLaboratorio(req, res) {
  try {
    const rol = (req.user && req.user.rol) ? req.user.rol.toLowerCase() : null;
    if (!rol || rol !== "administrador") return res.status(403).json({ error: "Acceso denegado: solo admin" });

    const { id } = req.params;
    const result = await eliminarLaboratorio(id);
    res.json(result);
  } catch (err) {
    console.error("❌ Error al eliminar laboratorio:", err);
    res.status(500).json({ error: "Error al eliminar laboratorio", detail: err.message });
  }
}

module.exports = {
  postMuestra,
  getMuestras,
  postMuestraBotanica,
  postMuestraSuelo,
  postMuestraDetrito,
  putEnvio,
  putRecepcion,
  getHerbarios,
  postHerbario,
  putHerbario,
  deleteHerbario,
  getLaboratorios,
  postLaboratorio,
  putLaboratorio,
  deleteLaboratorio
};
