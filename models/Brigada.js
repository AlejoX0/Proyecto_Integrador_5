const mongoose = require('mongoose');

const BrigadaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fecha_asignacion: { type: Date, default: Date.now },
  id_conglomerado: { type: String },
  lider_nro_documento: { type: String },
  descripcion: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Brigada', BrigadaSchema);
