// =============================================
// MODELO: UsuarioBrigada
// Representa la relación entre brigadas y usuarios
// Tabla: brigada_usuario
// =============================================

class UsuarioBrigada {
  constructor({ id_brigada, id_usuario, rol_en_brigada, fecha_inicio, fecha_fin }) {
    this.id_brigada = id_brigada;
    this.id_usuario = id_usuario;
    this.rol_en_brigada = rol_en_brigada;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin = fecha_fin;
  }
}

export default UsuarioBrigada;
