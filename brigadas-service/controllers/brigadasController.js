// ====================================================
// CONTROLADOR DE BRIGADAS
// ====================================================
import * as BrigadaService from "../services/brigadasService.js";

// ====================================================
// 🔹 Crear una brigada (solo administrador)
// ====================================================
export const crearBrigada = async (req, res) => {
  try {
    // Validar campos requeridos
    const { departamento, fecha_asignacion, id_conglomerado, lider } = req.body;

    if (!departamento || !fecha_asignacion || !lider) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const nuevaBrigada = await BrigadaService.crearBrigada(
      departamento,
      fecha_asignacion,
      id_conglomerado,
      lider
    );

    res.status(201).json({
      message: "✅ Brigada creada correctamente",
      data: nuevaBrigada,
    });
  } catch (error) {
    console.error("❌ Error al crear brigada:", error);
    res.status(500).json({ error: "Error interno al crear la brigada" });
  }
};

// ====================================================
// 🔹 Asignar conglomerado a una brigada existente
// ====================================================
export const asignarConglomerado = async (req, res) => {
  try {
    const { id_brigada } = req.params;
    const { id_conglomerado } = req.body;

    if (!id_brigada || !id_conglomerado) {
      return res.status(400).json({ error: "Faltan datos: id_brigada o id_conglomerado." });
    }

    const resultado = await BrigadaService.asignarConglomerado(
      id_brigada,
      id_conglomerado
    );

    if (!resultado) {
      return res.status(404).json({ error: "Brigada no encontrada." });
    }

    res.json({
      message: "✅ Conglomerado asignado correctamente",
      data: resultado,
    });
  } catch (error) {
    console.error("❌ Error al asignar conglomerado:", error);
    res.status(500).json({ error: "Error interno al asignar conglomerado" });
  }
};

// ====================================================
// 🔹 Listar brigadas (admin ve todas, jefes ven las suyas)
// ====================================================
export const listarBrigadas = async (req, res) => {
  try {
    // Verificamos rol (admin ve todas)
    const rol = req.user?.rol || "desconocido";
    const idUsuario = req.user?.id;

    let brigadas;

    if (rol === "administrador") {
      brigadas = await BrigadaService.listarBrigadas();
    } else {
      brigadas = await BrigadaService.listarBrigadasPorLider(idUsuario);
    }

    if (!brigadas || brigadas.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(brigadas);
  } catch (error) {
    console.error("❌ Error al listar brigadas:", error);
    res.status(500).json({ error: "Error interno al listar brigadas" });
  }
};