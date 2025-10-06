// ============================================
// RUTAS: Herramientas y uso de herramientas
// Protegidas por autenticación JWT
// ============================================

import express from "express";
import {
  crearHerramienta,
  listarHerramientas,
  registrarUso,
  obtenerUso,
} from "../controllers/herramientasController.js";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

// 🔐 Middleware de autenticación
router.use(verificarToken);

// CU7 - Crear herramienta (solo admin)
router.post("/", crearHerramienta);

// CU9 - Listar herramientas
router.get("/", listarHerramientas);

// CU8 - Registrar uso de herramienta
router.post("/uso", registrarUso);

// CU9 - Consultar uso de herramientas por brigada
router.get("/uso/:id_brigada", obtenerUso);

export default router;
