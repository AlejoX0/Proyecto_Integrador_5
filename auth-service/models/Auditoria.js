const mongoose = require("mongoose");

const auditoriaSchema = new mongoose.Schema({
  accion: { type: String, required: true }, // crear, actualizar, eliminar
  usuario_afectado: { type: String, required: true }, // nro_documento o correo
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  admin_correo: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  detalle: { type: String },
});

module.exports = mongoose.model("Auditoria", auditoriaSchema);