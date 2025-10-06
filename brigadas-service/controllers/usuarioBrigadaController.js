// ====================================================
// CONTROLADOR DE USUARIO-BRIGADA
// ====================================================
import * as UsuarioBrigadaService from "../services/usuarioBrigadaService.js";

// Asignar usuario a brigada
export const asignarUsuarioABrigada = async (req, res) => {
  try {
    const { id_usuario, id_brigada, rol_en_brigada } = req.body;
    const result = await UsuarioBrigadaService.asignarUsuarioABrigada(
      id_usuario,
      id_brigada,
      rol_en_brigada
    );
    res.status(201).json(result);
  } catch (error) {
    console.error("Error al asignar usuario a brigada:", error);
    res.status(500).json({ error: "Error al asignar usuario a brigada" });
  }
};

// Listar usuarios de una brigada
export const listarIntegrantes = async (req, res) => {
  try {
    const { id_brigada } = req.params;
    const usuarios = await UsuarioBrigadaService.listarIntegrantes(id_brigada);
    res.json(usuarios);
  } catch (error) {
    console.error("Error al listar integrantes:", error);
    res.status(500).json({ error: "Error al listar integrantes" });
  }
};

// Eliminar usuario de brigada
export const eliminarUsuarioDeBrigada = async (req, res) => {
  try {
    const { id_usuario, id_brigada } = req.body;
    const result = await UsuarioBrigadaService.eliminarUsuarioDeBrigada(
      id_usuario,
      id_brigada
    );
    res.json(result);
  } catch (error) {
    console.error("Error al eliminar usuario de brigada:", error);
    res.status(500).json({ error: "Error al eliminar usuario de brigada" });
  }
};
