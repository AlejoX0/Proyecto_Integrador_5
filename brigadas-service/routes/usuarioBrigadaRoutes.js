// ============================================
// RUTAS: Relación Usuario-Brigada
// ============================================

import express from "express";
import {
  asignarUsuarioABrigada,
  listarIntegrantesDeBrigada,
  eliminarUsuarioDeBrigada,
} from "../controllers/usuarioBrigadaController.js";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verificarToken);

// CU4 - Asignar usuario a brigada
router.post("/", asignarUsuarioABrigada);

// CU5 - Listar usuarios de una brigada
router.get("/:id_brigada", listarIntegrantesDeBrigada);

// CU6 - Eliminar usuario de brigada
router.delete("/:id_brigada/:id_usuario", eliminarUsuarioDeBrigada);

export default router;
