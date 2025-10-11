import * as UsuarioBrigadaService from "../services/usuarioBrigadaService.js";

// ====================================================
// CONTROLADOR: Usuario - Brigada
// ====================================================

// CU4 - Asignar usuario a brigada
export const asignarUsuarioABrigada = async (req, res) => {
  try {
    const { id_usuario, id_brigada, rol_en_brigada } = req.body;
    const result = await UsuarioBrigadaService.asignarUsuarioABrigada(
      id_usuario,
      id_brigada,
      rol_en_brigada
    );
    res.json(result);
  } catch (error) {
    console.error("❌ Error en asignarUsuarioABrigada:", error);
    res.status(500).json({ error: error.message });
  }
};

// CU5 - Listar integrantes de brigada
// CU5 - Listar integrantes de brigada
export const listarIntegrantesDeBrigada = async (req, res) => {
  try {
    const { id_brigada } = req.params;
    const { id, rol } = req.user; // ID del usuario logueado y rol

    let integrantes;

    if (rol.toLowerCase() === "administrador") {
      // Admin puede ver cualquier brigada
      integrantes = await UsuarioBrigadaService.listarIntegrantes(id_brigada);
    } else {
      // Usuario normal: solo si pertenece a la brigada
      const pertenece = await UsuarioBrigadaService.verificarUsuarioEnBrigada(id, id_brigada);
      if (!pertenece) {
        return res.status(403).json({ error: "Acceso denegado: no perteneces a esta brigada" });
      }
      integrantes = await UsuarioBrigadaService.listarIntegrantes(id_brigada);
    }

    res.json(integrantes);
  } catch (error) {
    console.error("❌ Error en listarIntegrantesDeBrigada:", error);
    res.status(500).json({ error: error.message });
  }
};


// CU6 - Eliminar usuario de brigada
export const eliminarUsuarioDeBrigada = async (req, res) => {
  try {
    const { id_usuario, id_brigada } = req.params;
    const result = await UsuarioBrigadaService.eliminarUsuarioDeBrigada(id_usuario, id_brigada);
    res.json(result);
  } catch (error) {
    console.error("❌ Error en eliminarUsuarioDeBrigada:", error);
    res.status(500).json({ error: error.message });
  }
};
