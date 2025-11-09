// routes/brigadasRoutes.js
const express = require("express");
const router = express.Router();

// ✅ Importamos el controlador una sola vez
const {
  crearBrigada,
  listarBrigadas,
  asignarConglomerado,
} = require("../controllers/brigadasController");

// ✅ Importamos middlewares
const { verificarToken, verificarRolAdmin } = require("../middleware/auth");

// 🔐 Todas las rutas requieren autenticación
router.use(verificarToken);

// ✅ Crear brigada (solo admin)
router.post("/", verificarRolAdmin(), crearBrigada);

// ✅ Listar brigadas (admin ve todas, usuarios normales solo su propia brigada)
router.get("/", listarBrigadas);

// ✅ Asignar conglomerado a brigada (solo admin)
router.put("/:id_brigada/conglomerado", verificarRolAdmin(), asignarConglomerado);

module.exports = router;