// services/geoGeneratorService.js
const turf = require('@turf/turf');
const fs = require('fs');
const path = require('path');

// -------------------------------------------------
// CARGAR GEOJSON DE DEPARTAMENTOS DE COLOMBIA
// (usa los límites reales del archivo descargado de GeoBoundaries)
// -------------------------------------------------
let departamentosGeo = null;

try {
  const geoPath = path.join(__dirname, 'geoBoundaries-COL-ADM1.geojson'); // <-- Ajusta el nombre si cambiaste el archivo
  const rawData = fs.readFileSync(geoPath, 'utf-8');
  departamentosGeo = JSON.parse(rawData);
  console.log('✅ GeoJSON de departamentos cargado correctamente');
} catch (error) {
  console.warn('⚠️ No se pudo cargar el GeoJSON de departamentos. Solo se usará el modo aproximado.');
}

// -------------------------------------------------
// DEFINICIÓN DE DEPARTAMENTOS DE COLOMBIA (32 + Bogotá D.C.)
// Coordenadas aproximadas (fallback si no hay GeoJSON disponible)
// -------------------------------------------------
const departamentos = {
  Amazonas: { minLat: -4.5, maxLat: -0.5, minLng: -74.5, maxLng: -69.5 },
  Antioquia: { minLat: 5.0, maxLat: 8.0, minLng: -76.5, maxLng: -73.0 },
  Arauca: { minLat: 6.0, maxLat: 7.5, minLng: -72.0, maxLng: -69.5 },
  Atlántico: { minLat: 10.5, maxLat: 11.2, minLng: -75.2, maxLng: -74.5 },
  Bolívar: { minLat: 8.0, maxLat: 10.8, minLng: -75.9, maxLng: -73.5 },
  Boyacá: { minLat: 4.8, maxLat: 6.3, minLng: -74.5, maxLng: -72.0 },
  Caldas: { minLat: 4.6, maxLat: 5.8, minLng: -75.8, maxLng: -74.8 },
  Caquetá: { minLat: -1.5, maxLat: 2.0, minLng: -76.0, maxLng: -72.0 },
  Casanare: { minLat: 4.2, maxLat: 6.5, minLng: -72.8, maxLng: -70.8 },
  Cauca: { minLat: 1.0, maxLat: 3.5, minLng: -77.8, maxLng: -75.0 },
  Cesar: { minLat: 8.0, maxLat: 10.5, minLng: -74.3, maxLng: -72.5 },
  Chocó: { minLat: 4.0, maxLat: 8.6, minLng: -78.9, maxLng: -76.5 },
  Córdoba: { minLat: 7.3, maxLat: 9.2, minLng: -76.4, maxLng: -74.5 },
  Cundinamarca: { minLat: 4.0, maxLat: 5.6, minLng: -75.0, maxLng: -73.3 },
  Guainía: { minLat: 0.0, maxLat: 3.5, minLng: -70.0, maxLng: -66.8 },
  Guaviare: { minLat: 1.0, maxLat: 3.0, minLng: -73.5, maxLng: -69.5 },
  Huila: { minLat: 1.5, maxLat: 3.5, minLng: -76.5, maxLng: -74.5 },
  LaGuajira: { minLat: 10.5, maxLat: 12.5, minLng: -73.6, maxLng: -71.0 },
  Magdalena: { minLat: 9.0, maxLat: 11.3, minLng: -75.5, maxLng: -73.0 },
  Meta: { minLat: 2.0, maxLat: 5.0, minLng: -74.5, maxLng: -71.0 },
  Nariño: { minLat: -1.5, maxLat: 2.0, minLng: -79.0, maxLng: -76.0 },
  NorteDeSantander: { minLat: 6.8, maxLat: 9.0, minLng: -73.5, maxLng: -71.5 },
  Putumayo: { minLat: -1.0, maxLat: 1.0, minLng: -77.3, maxLng: -74.8 },
  Quindío: { minLat: 4.2, maxLat: 4.8, minLng: -75.9, maxLng: -75.3 },
  Risaralda: { minLat: 4.6, maxLat: 5.5, minLng: -76.2, maxLng: -75.3 },
  SanAndrés: { minLat: 12.5, maxLat: 13.5, minLng: -82.0, maxLng: -81.5 },
  Santander: { minLat: 5.8, maxLat: 8.0, minLng: -74.3, maxLng: -72.0 },
  Sucre: { minLat: 8.0, maxLat: 9.8, minLng: -75.8, maxLng: -74.5 },
  Tolima: { minLat: 3.0, maxLat: 5.3, minLng: -76.0, maxLng: -74.3 },
  ValleDelCauca: { minLat: 3.0, maxLat: 5.0, minLng: -77.5, maxLng: -75.8 },
  Vaupés: { minLat: -1.5, maxLat: 2.0, minLng: -71.8, maxLng: -69.5 },
  Vichada: { minLat: 3.0, maxLat: 6.0, minLng: -71.0, maxLng: -67.0 },
  BogotáDC: { minLat: 4.4, maxLat: 4.9, minLng: -74.3, maxLng: -73.9 }
};

// -------------------------------------------------
// MÉTODO ORIGINAL (APROXIMADO) - USA BOUNDING BOX
// -------------------------------------------------
function generarCoordenada(region = null) {
  let bbox;
  if (region && departamentos[region]) {
    bbox = departamentos[region];
  } else {
    // Todo el país (aproximación general)
    bbox = { minLat: -4.8, maxLat: 13.5, minLng: -79.0, maxLng: -66.8 };
  }

  const lat = bbox.minLat + Math.random() * (bbox.maxLat - bbox.minLat);
  const lng = bbox.minLng + Math.random() * (bbox.maxLng - bbox.minLng);
  return { lat, lng, region: region || 'Colombia' };
}

// -------------------------------------------------
// NUEVO MÉTODO (PRECISO) - USA GEOJSON DEPARTAMENTOS
// -------------------------------------------------
function generarCoordenadaReal(departamentoNombre = null) {
  if (!departamentosGeo) {
    console.warn('⚠️ GeoJSON no cargado, usando modo aproximado.');
    return generarCoordenada(departamentoNombre);
  }

  let feature;

  // Buscar por nombre (campo "shapeName" del GeoJSON de GeoBoundaries)
  if (departamentoNombre) {
    feature = departamentosGeo.features.find(f =>
      f.properties.shapeName.toLowerCase() ===
      departamentoNombre.toLowerCase()
    );
    if (!feature) {
      console.warn(`⚠️ Departamento "${departamentoNombre}" no encontrado. Usando modo general.`);
      return generarCoordenada(departamentoNombre);
    }
  }

  const bbox = feature ? turf.bbox(feature) : turf.bbox(departamentosGeo);

  let punto;
  do {
    const random = turf.randomPoint(1, { bbox });
    punto = random.features[0];
  } while (feature && !turf.booleanPointInPolygon(punto, feature));

  const [lng, lat] = punto.geometry.coordinates;
  return { lat, lng, region: departamentoNombre || 'Colombia' };
}

// -------------------------------------------------
// EXPORTAR FUNCIONES
// -------------------------------------------------
module.exports = {
  generarCoordenada,          // Método rápido y aproximado
  generarCoordenadaReal,      // Método preciso con GeoJSON
  departamentos               // Bounding boxes de fallback
};
