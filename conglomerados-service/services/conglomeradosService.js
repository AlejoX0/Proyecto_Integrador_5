// services/conglomeradosService.js
const pool = require('../db/postgres');
const crypto = require('crypto');

/**
 * Utils geodésicas (suficientes para distancias cortas)
 * destinationPoint: dado lat, lng, distance(m) y bearing(deg) devuelve {lat,lng}
 */
function destinationPoint(lat, lng, distanceMeters, bearingDeg) {
  const R = 6378137; // m (WGS84)
  const δ = distanceMeters / R;
  const θ = (bearingDeg * Math.PI) / 180;
  const φ1 = (lat * Math.PI) / 180;
  const λ1 = (lng * Math.PI) / 180;

  const φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
    );

  return { lat: (φ2 * 180) / Math.PI, lng: ((λ2 * 180) / Math.PI + 540) % 360 - 180 };
}

function generarCodigo(prefix = 'CONG') {
  const rnd = crypto.randomBytes(3).toString('hex');
  return `${prefix.toUpperCase()}-${Date.now().toString().slice(-6)}-${rnd}`;
}

/**
 * Crea conglomerado manual + NO crea subparcelas automáticamente (se puede llamar otra función para generarlas),
 * o si 'autoCreateSubparcelas' true -> también crea las 5 subparcelas IFN (centro + 4 cardinales)
 */
async function crearConglomeradoManual(data, options = { autoCreateSubparcelas: true }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const codigo = data.codigo || generarCodigo('CONG');
    const ubicacion = data.ubicacion; // json {lat,lng,municipio?,departamento?}
    const estado = data.estado || 'pendiente';

    const insertCong = `INSERT INTO conglomerado (codigo, ubicacion, estado, fecha_inicio)
                        VALUES ($1, $2::jsonb, $3, CURRENT_DATE) RETURNING *`;
    const { rows } = await client.query(insertCong, [codigo, JSON.stringify(ubicacion), estado]);
    const cong = rows[0];

    let createdSubparcelas = [];
    if (options.autoCreateSubparcelas) {
      createdSubparcelas = await _crearSubparcelasIfn(client, cong.id_conglomerado, ubicacion.lat, ubicacion.lng);
    }

    await client.query('COMMIT');
    return { conglomerado: cong, subparcelas: createdSubparcelas };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * crearConglomeradosAutomatico: crea N conglomerados dentro de bbox o región simple
 * params: { cantidad, bbox: {minLat,maxLat,minLng,maxLng}, region(optional), distancia_subparcelas_m (default 80) }
 */
async function crearConglomeradosAutomatico(params = {}) {
  const { cantidad = 1, bbox } = params;
  if (!cantidad || typeof cantidad !== 'number' || cantidad <= 0) {
    throw new Error('cantidad debe ser numero > 0');
  }
  const usedBbox = bbox || { minLat: -4.8, maxLat: 13.5, minLng: -79.0, maxLng: -66.8 }; // Colombia approx
  const created = [];
  for (let i = 0; i < cantidad; i++) {
    const lat = usedBbox.minLat + Math.random() * (usedBbox.maxLat - usedBbox.minLat);
    const lng = usedBbox.minLng + Math.random() * (usedBbox.maxLng - usedBbox.minLng);
    const result = await crearConglomeradoManual({ codigo: generarCodigo('CONG'), ubicacion: { lat, lng } }, { autoCreateSubparcelas: true });
    created.push(result);
  }
  return created;
}

/**
 * Interna: crear las 5 subparcelas (IFN): SPF-1 central, SPF-2 N (0deg), SPF-3 S(180), SPF-4 E(90), SPF-5 W(270)
 * Distancia entre centros = 80m; radios anidados: 15,7,3,1.5 (we store main radio 15)
 */
async function _crearSubparcelasIfn(client, id_conglomerado, centroLat, centroLng, distancia = 80) {
  // radios por categoría (m)
  const radios = {
    fustales_grandes: 15,
    fustales: 7,
    latizales: 3,
    brinzales: 1.5
  };

  const spfList = [
    { code: 'SPF-1', lat: centroLat, lng: centroLng },
    // bearings: North (0), East (90), South (180), West (270)
    { code: 'SPF-2', ...destinationPoint(centroLat, centroLng, distancia, 0) },
    { code: 'SPF-3', ...destinationPoint(centroLat, centroLng, distancia, 180) },
    { code: 'SPF-4', ...destinationPoint(centroLat, centroLng, distancia, 90) },
    { code: 'SPF-5', ...destinationPoint(centroLat, centroLng, distancia, 270) }
  ];

  const inserted = [];
  for (const spf of spfList) {
    // area for FG (15m)
    const areaFG = Math.PI * Math.pow(radios.fustales_grandes, 2); // m2
    const insertSub = `INSERT INTO subparcela (id_conglomerado, categoria, radio, centro_lat, centro_lng, area)
                       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const vals = [id_conglomerado, 'fustales_grandes', radios.fustales_grandes, spf.lat, spf.lng, areaFG];
    const { rows } = await client.query(insertSub, vals);
    inserted.push({ spf: spf.code, row: rows[0] });
  }
  return inserted;
}

async function listarConglomerados() {
  const { rows } = await pool.query('SELECT * FROM listar_conglomerados()'); // function SQL provided below
  return rows;
}

async function obtenerConglomeradoPorId(id) {
  const { rows } = await pool.query('SELECT * FROM conglomerado WHERE id_conglomerado = $1', [id]);
  if (rows.length === 0) return null;
  const cong = rows[0];
  const subs = await pool.query('SELECT * FROM listar_subparcelas_por_conglomerado($1)', [id]);
  return { conglomerado: cong, subparcelas: subs.rows };
}

module.exports = {
  crearConglomeradoManual,
  crearConglomeradosAutomatico,
  listarConglomerados,
  obtenerConglomeradoPorId
};
