// ============================================
// RUTAS: Brigadas
// ============================================

import express from "express";
import {
  crearBrigada,
  listarBrigadas,
  asignarConglomerado,
} from "../controllers/brigadasController.js";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verificarToken);

router.post("/", crearBrigada); // CU1
router.get("/", listarBrigadas); // CU2
router.put("/:id_brigada/conglomerado", asignarConglomerado); // CU3

export default router;
