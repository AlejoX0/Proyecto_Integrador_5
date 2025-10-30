const express = require("express");
const router = express.Router();
const { verificarToken, verificarRol } = require("../middleware/authMiddleware");
const {
  postIndividuo,
  getIndividuos,
  putIndividuo,
  deleteIndividuo,
} = require("../controllers/individuosController");

// Crear (Auxiliar o Admin)
router.post("/", verificarToken, verificarRol(["auxiliar de campo", "administrador"]), postIndividuo);

// Leer (todos)
router.get("/:id_subparcela", verificarToken, getIndividuos);

// Actualizar (Auxiliar, Jefe, Admin)
router.put("/:id_individuo", verificarToken, verificarRol(["auxiliar de campo", "jefe de brigada", "administrador"]), putIndividuo);

// Eliminar (solo Admin)
router.delete("/:id_individuo", verificarToken, verificarRol(["administrador"]), deleteIndividuo);

module.exports = router;
