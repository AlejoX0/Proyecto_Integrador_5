// models/Conglomerado.js
class Conglomerado {
  constructor({ id_conglomerado = null, codigo, ubicacion, estado = 'pendiente', fecha_inicio = null, fecha_fin = null }) {
    this.id_conglomerado = id_conglomerado;
    this.codigo = codigo;
    this.ubicacion = ubicacion;
    this.estado = estado;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin = fecha_fin;
  }

  static validarManual(data) {
    if (!data.codigo) throw new Error('codigo requerido');
    if (!data.ubicacion || typeof data.ubicacion.lat !== 'number' || typeof data.ubicacion.lng !== 'number') {
      throw new Error('ubicacion {lat:number, lng:number} requerida');
    }
    return true;
  }
}

module.exports = Conglomerado;
