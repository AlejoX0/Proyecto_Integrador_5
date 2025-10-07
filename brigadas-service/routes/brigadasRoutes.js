// ============================================
// RUTAS: Brigadas
// ============================================

const express = require("express");
const router = express.Router();

const {
  crearBrigada,
  listarBrigadas,
  asignarConglomerado,
} = require("../controllers/brigadasController");

const { verificarToken } = require("../middleware/authMiddleware");

// 🔐 Middleware de autenticación
router.use(verificarToken);

// CU1 - Crear brigada
router.post("/", crearBrigada);

// CU2 - Listar brigadas
router.get("/", listarBrigadas);

// CU3 - Asignar conglomerado a brigada
router.put("/:id_brigada/conglomerado", asignarConglomerado);

module.exports = router;
