const Brigada = require('../models/Brigada');

exports.obtenerBrigadas = async () => {
  return await Brigada.find().sort({ createdAt: -1 });
};

exports.crearBrigada = async (datos) => {
  const brigada = new Brigada(datos);
  await brigada.save();
  return brigada;
};
