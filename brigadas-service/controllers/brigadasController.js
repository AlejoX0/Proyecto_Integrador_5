// ====================================================
// CONTROLADOR DE BRIGADAS
// ====================================================
import * as BrigadaService from "../services/brigadasService.js";

// 🔹 Crear una brigada (rol: administrador)
export const crearBrigada = async (req, res) => {
  try {
    // 👇 Se reemplaza 'nombre' por 'departamento'
    const { departamento, fecha_asignacion, id_conglomerado, lider } = req.body;

    const result = await BrigadaService.crearBrigada(
      departamento,
      fecha_asignacion,
      id_conglomerado,
      lider
    );

    res.status(201).json({
      message: "Brigada creada correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error al crear brigada:", error);
    res.status(500).json({ error: "Error al crear la brigada" });
  }
};

// 🔹 Asignar conglomerado a brigada
export const asignarConglomerado = async (req, res) => {
  try {
    const { id_brigada, id_conglomerado } = req.body;
    const result = await BrigadaService.asignarConglomerado(id_brigada, id_conglomerado);
    res.json({
      message: "Conglomerado asignado correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error al asignar conglomerado:", error);
    res.status(500).json({ error: "Error al asignar conglomerado" });
  }
};

// 🔹 Listar brigadas
export const listarBrigadas = async (req, res) => {
  try {
    const brigadas = await BrigadaService.listarBrigadas();
    res.json(brigadas);
  } catch (error) {
    console.error("Error al listar brigadas:", error);
    res.status(500).json({ error: "Error al listar brigadas" });
  }
};
