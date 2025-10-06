// =========================================
// MODELO: Brigada
// Representa la tabla "brigada" del sistema
// =========================================

class Brigada {
  constructor({ id_brigada, nombre, fecha_asignacion, id_conglomerado, lider }) {
    this.id_brigada = id_brigada;
    this.nombre = nombre;
    this.fecha_asignacion = fecha_asignacion;
    this.id_conglomerado = id_conglomerado;
    this.lider = lider;
  }
}

export default Brigada;
