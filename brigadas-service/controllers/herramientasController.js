// ====================================================
// CONTROLADOR DE HERRAMIENTAS (versión corregida)
// ====================================================

import * as HerramientasService from "../services/herramientasService.js";

// 🧰 CU7 - Crear herramienta (solo admin)
export const crearHerramienta = async (req, res) => {
  try {
    const user = req.user;

    if (user.rol !== "administrador") {
      return res
        .status(403)
        .json({ message: "Solo los administradores pueden crear herramientas" });
    }

    // nombre, descripcion, cantidad_disponible (opcional)
    const nueva = await HerramientasService.crearHerramienta(req.body);

    res.status(201).json({
      ok: true,
      message: "Herramienta creada exitosamente",
      herramienta: nueva,
    });
  } catch (error) {
    console.error("❌ Error al crear herramienta:", error);
    res
      .status(500)
      .json({ ok: false, error: "Error interno al crear herramienta" });
  }
};

// 👀 CU9 - Listar herramientas
export const listarHerramientas = async (req, res) => {
  try {
    const lista = await HerramientasService.listarHerramientas();

    res.status(200).json({
      ok: true,
      herramientas: lista,
    });
  } catch (error) {
    console.error("❌ Error al listar herramientas:", error);
    res
      .status(500)
      .json({ ok: false, error: "Error interno al listar herramientas" });
  }
};

// 🛠️ CU8 - Registrar uso de herramienta (brigadista o jefe)
export const registrarUso = async (req, res) => {
  try {
    const user = req.user;

    if (user.rol !== "brigadista" && user.rol !== "jefe") {
      return res.status(403).json({
        message: "No autorizado para registrar uso de herramientas",
      });
    }

    // ⚠️ El body debe tener id_herramienta y id_brigada (id_usuario ya no se usa)
    const { id_herramienta, id_brigada, estado } = req.body;

    if (!id_herramienta || !id_brigada) {
      return res
        .status(400)
        .json({ message: "Faltan datos: id_herramienta o id_brigada" });
    }

    const registro = await HerramientasService.registrarUso({
      id_herramienta,
      id_brigada,
      estado,
    });

    res.status(201).json({
      ok: true,
      message: "Uso de herramienta registrado correctamente",
      uso: registro,
    });
  } catch (error) {
    console.error("❌ Error al registrar uso de herramienta:", error);
    res.status(500).json({
      ok: false,
      error: "Error interno al registrar uso de herramienta",
    });
  }
};

// 📊 CU9 - Consultar uso de herramientas por brigada
export const obtenerUso = async (req, res) => {
  try {
    const { id_brigada } = req.params;

    if (!id_brigada) {
      return res.status(400).json({ message: "Falta el parámetro id_brigada" });
    }

    const data = await HerramientasService.obtenerUso(id_brigada);

    res.status(200).json({
      ok: true,
      usos: data,
    });
  } catch (error) {
    console.error("❌ Error al obtener uso de herramientas:", error);
    res
      .status(500)
      .json({ ok: false, error: "Error interno al obtener uso de herramientas" });
  }
};
