// ====================================================
// CONTROLADOR DE HERRAMIENTAS
// ====================================================
import * as HerramientasService from "../services/herramientasService.js";

// CU7 - Crear herramienta (solo admin)
export const crearHerramienta = async (req, res) => {
  try {
    const user = req.user;
    if (user.rol !== "administrador") {
      return res.status(403).json({ message: "Solo los administradores pueden crear herramientas" });
    }

    const nueva = await HerramientasService.crearHerramienta(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    console.error("Error al crear herramienta:", error);
    res.status(500).json({ error: "Error al crear herramienta" });
  }
};

// CU9 - Listar herramientas
export const listarHerramientas = async (req, res) => {
  try {
    const lista = await HerramientasService.listarHerramientas();
    res.json(lista);
  } catch (error) {
    console.error("Error al listar herramientas:", error);
    res.status(500).json({ error: "Error al listar herramientas" });
  }
};

// CU8 - Registrar uso de herramienta (brigadista o jefe)
export const registrarUso = async (req, res) => {
  try {
    const user = req.user;
    if (user.rol !== "brigadista" && user.rol !== "jefe") {
      return res.status(403).json({ message: "No autorizado para registrar uso de herramientas" });
    }

    const registro = await HerramientasService.registrarUso(req.body);
    res.status(201).json(registro);
  } catch (error) {
    console.error("Error al registrar uso:", error);
    res.status(500).json({ error: "Error al registrar uso de herramienta" });
  }
};

// CU9 - Consultar uso de herramientas por brigada
export const obtenerUso = async (req, res) => {
  try {
    const { id_brigada } = req.params;
    const data = await HerramientasService.obtenerUso(id_brigada);
    res.json(data);
  } catch (error) {
    console.error("Error al obtener uso de herramientas:", error);
    res.status(500).json({ error: "Error al obtener uso de herramientas" });
  }
};
