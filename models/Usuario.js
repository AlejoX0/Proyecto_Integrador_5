const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nro_documento: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String },
  password: { type: String, required: true },
  rol: { type: String, enum: ["usuario", "admin", "encargado", "desarrollador"], default: "usuario" }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', UsuarioSchema);
