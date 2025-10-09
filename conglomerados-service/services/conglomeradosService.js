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
 * Crea conglomerado manual + si options.autoCreateSubparcelas true -> crea las 5 subparcelas IFN
 * (cada SPF contendrá las subparcelas anidadas: fustales_grandes, fustales, latizales, brinzales)
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
 * Interna: crear las 5 subparcelas IFN (centro + 4 cardinales)
 * Distancia entre centros = 80m por defecto; para cada SPF se crean las subparcelas:
 *  - fustales_grandes (15 m)
 *  - fustales (7 m)
 *  - latizales (3 m)
 *  - brinzales (1.5 m)
 *
 * Devuelve array con los registros insertados.
 */
async function _crearSubparcelasIfn(client, id_conglomerado, centroLat, centroLng, distancia = 80) {
  // radios por categoría (m)
  const radios = [
    { categoria: 'fustales_grandes', radio: 15.0 },
    { categoria: 'fustales', radio: 7.0 },
    { categoria: 'latizales', radio: 3.0 },
    { categoria: 'brinzales', radio: 1.5 }
  ];

  // SPF list: centro + N,E,S,W
  const spfList = [
    { code: 'SPF-1', lat: centroLat, lng: centroLng },
    { code: 'SPF-2', ...destinationPoint(centroLat, centroLng, distancia, 0) },   // North (0°)
    { code: 'SPF-3', ...destinationPoint(centroLat, centroLng, distancia, 180) }, // South (180°)
    { code: 'SPF-4', ...destinationPoint(centroLat, centroLng, distancia, 90) },  // East (90°)
    { code: 'SPF-5', ...destinationPoint(centroLat, centroLng, distancia, 270) }  // West (270°)
  ];

  const inserted = [];

  // Prepared INSERT string: incluimos centro_lat, centro_lon, centro_lng por compatibilidad con tu esquema
  const insertSubSql = `
    INSERT INTO subparcela (id_conglomerado, categoria, radio, area, centro_lat, centro_lon, centro_lng)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  for (const spf of spfList) {
    for (const r of radios) {
      const area = parseFloat((Math.PI * Math.pow(r.radio, 2)).toFixed(2)); // redondear a 2 decimales
      const vals = [
        id_conglomerado,
        r.categoria,
        r.radio,
        area,
        spf.lat,
        spf.lng, // centro_lon
        spf.lng  // centro_lng (duplicado por compatibilidad si tenés ambas columnas)
      ];
      const { rows } = await client.query(insertSubSql, vals);
      inserted.push({
        spf: spf.code,
        categoria: r.categoria,
        record: rows[0]
      });
    }
  }

  return inserted;
}

async function listarConglomerados() {
  const { rows } = await pool.query('SELECT * FROM listar_conglomerados()'); // function SQL en DB
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
