// models/Subparcela.js
class Subparcela {
  constructor({ id_subparcela = null, id_conglomerado, codigo_spf, centro_lat, centro_lng, categoria, radio, area }) {
    this.id_subparcela = id_subparcela;
    this.id_conglomerado = id_conglomerado;
    this.codigo_spf = codigo_spf; // 'SPF-1', 'SPF-2', ...
    this.centro_lat = centro_lat;
    this.centro_lng = centro_lng;
    this.categoria = categoria;
    this.radio = radio;
    this.area = area;
  }

  static radiosByCategory() {
    // radios en metros por categoría anidada
    return {
      'brinzales': 1.5,
      'latizales': 3,
      'fustales': 7,
      'fustales_grandes': 15
    };
  }
}

module.exports = Subparcela;
