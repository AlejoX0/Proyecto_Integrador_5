const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/muestrasController");
const { verificarRol } = require("../middleware/authMiddleware");
// Crear muestra (Auxiliar, Jefe, Botánico o Administrador)
router.post("/", verificarRol(["Auxiliar", "Jefe", "Botanico", "Admin"]), ctrl.postMuestra);

// Obtener todas las muestras (accesible para todos los roles)
router.get("/", verificarRol(["Todos"]), ctrl.getMuestras);
// Muestra botánica: solo Botánico o Administrador
router.post("/botanica", verificarRol(["Botanico", "Admin"]), ctrl.postMuestraBotanica);

// Muestra de suelo: Auxiliar o Administrador
router.post("/suelo", verificarRol(["Auxiliar", "Admin"]), ctrl.postMuestraSuelo);

// Muestra de detrito: Auxiliar o Administrador
router.post("/detrito", verificarRol(["Auxiliar", "Admin"]), ctrl.postMuestraDetrito);
// Enviar muestra: Jefe o Administrador
router.put("/:id/enviar", verificarRol(["Jefe", "Admin"]), ctrl.putEnvio);

// Recibir muestra: Administrador o Jefe
router.put("/:id/recibir", verificarRol(["Admin", "Jefe"]), ctrl.putRecepcion);

router.get("/herbarios", verificarRol(["Admin", "Botanico"]), ctrl.getHerbarios);

// Crear nuevo herbario (solo Admin)
router.post("/herbarios", verificarRol(["Admin"]), ctrl.postHerbario);

// Actualizar herbario (solo Admin)
router.put("/herbarios/:id", verificarRol(["Admin"]), ctrl.putHerbario);

// Eliminar herbario (solo Admin)
router.delete("/herbarios/:id", verificarRol(["Admin"]), ctrl.deleteHerbario);
// Consultar laboratorios
router.get("/laboratorios", verificarRol(["Admin", "Jefe"]), ctrl.getLaboratorios);

// Crear laboratorio (solo Admin)
router.post("/laboratorios", verificarRol(["Admin"]), ctrl.postLaboratorio);

// Actualizar laboratorio (solo Admin)
router.put("/laboratorios/:id", verificarRol(["Admin"]), ctrl.putLaboratorio);

// Eliminar laboratorio (solo Admin)
router.delete("/laboratorios/:id", verificarRol(["Admin"]), ctrl.deleteLaboratorio);

module.exports = router;
