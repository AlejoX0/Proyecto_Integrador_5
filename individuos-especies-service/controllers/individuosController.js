const {
  crearIndividuo,
  listarIndividuosPorSubparcela,
  actualizarIndividuo,
  eliminarIndividuo,
} = require("../services/individuosService");

// Crear individuo
async function postIndividuo(req, res) {
  try {
    const { id_subparcela, id_especie, diametro, altura, estado, observaciones } = req.body;
    const result = await crearIndividuo(id_subparcela, id_especie, diametro, altura, estado, observaciones);
    res.json(result);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Error al crear individuo" });
  }
}

// Consultar
async function getIndividuos(req, res) {
  try {
    const { id_subparcela } = req.params;
    const data = await listarIndividuosPorSubparcela(id_subparcela);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener individuos" });
  }
}

// Actualizar
async function putIndividuo(req, res) {
  try {
    const { id_individuo } = req.params;
    const campos = req.body;
    const result = await actualizarIndividuo(id_individuo, campos);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar individuo" });
  }
}

// Eliminar
async function deleteIndividuo(req, res) {
  try {
    const { id_individuo } = req.params;
    const result = await eliminarIndividuo(id_individuo);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar individuo" });
  }
}

module.exports = {
  postIndividuo,
  getIndividuos,
  putIndividuo,
  deleteIndividuo,
};
