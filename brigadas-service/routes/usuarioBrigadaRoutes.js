// ============================================
// RUTAS: Relación Usuario-Brigada
// ============================================

import express from "express";
import {
  asignarUsuarioABrigada,
  listarIntegrantesDeBrigada,
  removerUsuarioDeBrigada,
} from "../controllers/usuarioBrigadaController.js";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verificarToken);

router.post("/", asignarUsuarioABrigada); // CU4
router.get("/:id_brigada", listarIntegrantesDeBrigada); // CU5
router.delete("/:id_brigada/:id_usuario", removerUsuarioDeBrigada); // CU6

export default router;
