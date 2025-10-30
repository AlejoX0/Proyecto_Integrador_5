const {
  crearEspecie,
  listarEspecies,
  actualizarEspecie,
  eliminarEspecie,
} = require("../services/especiesService");

async function postEspecie(req, res) {
  try {
    const { nombre_cientifico, nombre_comun, estado_conservacion, uso } = req.body;
    const result = await crearEspecie(nombre_cientifico, nombre_comun, estado_conservacion, uso);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al crear especie" });
  }
}

async function getEspecies(req, res) {
  try {
    const data = await listarEspecies();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener especies" });
  }
}

async function putEspecie(req, res) {
  try {
    const { id_especie } = req.params;
    const campos = req.body;
    const result = await actualizarEspecie(id_especie, campos, req.user.rol);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar especie" });
  }
}

async function deleteEspecie(req, res) {
  try {
    const { id_especie } = req.params;
    const result = await eliminarEspecie(id_especie);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar especie" });
  }
}

module.exports = {
  postEspecie,
  getEspecies,
  putEspecie,
  deleteEspecie,
};
