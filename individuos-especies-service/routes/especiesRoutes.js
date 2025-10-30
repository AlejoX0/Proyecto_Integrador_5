const express = require("express");
const router = express.Router();
const { verificarToken, verificarRol } = require("../middleware/authMiddleware");
const {
  postEspecie,
  getEspecies,
  putEspecie,
  deleteEspecie,
} = require("../controllers/especiesController");

// Crear (Botánico o Admin)
router.post("/", verificarToken, verificarRol(["botanico", "administrador"]), postEspecie);

// Leer (todos)
router.get("/", verificarToken, getEspecies);

// Actualizar (Botánico, Coinvestigador o Admin)
router.put("/:id_especie", verificarToken, verificarRol(["botanico", "coinvestigador", "administrador"]), putEspecie);

// Eliminar (solo Admin)
router.delete("/:id_especie", verificarToken, verificarRol(["administrador"]), deleteEspecie);

module.exports = router;
