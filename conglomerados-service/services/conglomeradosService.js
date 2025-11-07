

const pool = require('../db/postgres');
const crypto = require('crypto');
const { generarCoordenada, departamentos } = require('./geoGeneratorService'); // ✅ Servicio de coordenadas

// =========================================================
// 🌍 UTILIDADES GEODÉSICAS
// =========================================================
function destinationPoint(lat, lng, distanceMeters, bearingDeg) {
  const R = 6378137; // Radio de la Tierra (m)
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

  return {
    lat: (φ2 * 180) / Math.PI,
    lng: ((λ2 * 180) / Math.PI + 540) % 360 - 180
  };
}

// =========================================================
// 🔑 GENERADOR DE CÓDIGOS
// =========================================================
function generarCodigo(prefix = 'CONG') {
  const rnd = crypto.randomBytes(3).toString('hex');
  return `${prefix}-${Date.now().toString().slice(-6)}-${rnd}`;
}

// =========================================================
// 🧱 CREAR CONGLOMERADO MANUAL
// =========================================================
async function crearConglomeradoManual(data, options = { autoCreateSubparcelas: true }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const codigo = data.codigo || generarCodigo('CONG');
    const ubicacion = data.ubicacion;
    const estado = data.estado || 'pendiente';

    console.log(`📦 Creando conglomerado manualmente → ${codigo}`);
    console.log(`📍 Ubicación: ${ubicacion.lat}, ${ubicacion.lng} (${ubicacion.region})`);

    const insertCong = `
      INSERT INTO conglomerado (codigo, ubicacion, estado, fecha_inicio)
      VALUES ($1, $2::jsonb, $3, CURRENT_DATE)
      RETURNING *;
    `;
    const { rows } = await client.query(insertCong, [codigo, JSON.stringify(ubicacion), estado]);
    const cong = rows[0];

    let createdSubparcelas = [];
    if (options.autoCreateSubparcelas) {
      console.log('🌳 Generando subparcelas IFN...');
      createdSubparcelas = await _crearSubparcelasIFN(client, cong.id_conglomerado, ubicacion.lat, ubicacion.lng);
    }

    await client.query('COMMIT');
    console.log(`✅ Conglomerado creado exitosamente: ${codigo}`);
    return { conglomerado: cong, subparcelas: createdSubparcelas };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error al crear conglomerado manual:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// =========================================================
// 🤖 CREAR CONGLOMERADOS AUTOMÁTICAMENTE
// =========================================================
async function crearConglomeradosAutomatico(params = {}) {
  const { cantidad = 1, region = null } = params;

  if (!cantidad || typeof cantidad !== 'number' || cantidad <= 0) {
    throw new Error('❗ La cantidad debe ser un número mayor que 0');
  }

  console.log(`🚀 Generando ${cantidad} conglomerado(s) automáticamente...`);
  if (region) console.log(`📍 Región objetivo: ${region}`);

  const creados = [];
  for (let i = 0; i < cantidad; i++) {
    const ubicacion = generarCoordenada(region);
    const codigo = generarCodigo('CONG');
    console.log(`📦 Creando conglomerado #${i + 1}: ${codigo}`);
    const resultado = await crearConglomeradoManual(
      { codigo, ubicacion },
      { autoCreateSubparcelas: true }
    );
    creados.push(resultado);
  }

  console.log(`✅ ${creados.length} conglomerado(s) creados correctamente`);
  return creados;
}

// =========================================================
// 🌲 CREAR SUBPARCELAS (IFN)
// =========================================================
async function _crearSubparcelasIFN(client, id_conglomerado, centroLat, centroLng, distancia = 80) {
  console.log(`📍 Generando subparcelas para conglomerado ${id_conglomerado}`);

  const radios = [
    { categoria: 'fustales_grandes', radio: 15.0 },
    { categoria: 'fustales', radio: 7.0 },
    { categoria: 'latizales', radio: 3.0 },
    { categoria: 'brinzales', radio: 1.5 }
  ];

  // SPF: Subparcelas principales alrededor del centro
  const spfList = [
    { code: 'SPF-1', lat: centroLat, lng: centroLng },
    { code: 'SPF-2', ...destinationPoint(centroLat, centroLng, distancia, 0) },
    { code: 'SPF-3', ...destinationPoint(centroLat, centroLng, distancia, 180) },
    { code: 'SPF-4', ...destinationPoint(centroLat, centroLng, distancia, 90) },
    { code: 'SPF-5', ...destinationPoint(centroLat, centroLng, distancia, 270) }
  ];

  const inserted = [];
  const insertSQL = `
    INSERT INTO subparcela (id_conglomerado, categoria, radio, area, centro_lat, centro_lon, centro_lng)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  for (const spf of spfList) {
    console.log(`🧭 Creando subparcelas en ${spf.code}...`);
    for (const r of radios) {
      const area = parseFloat((Math.PI * Math.pow(r.radio, 2)).toFixed(2));
      const values = [
        id_conglomerado,
        r.categoria,
        r.radio,
        area,
        spf.lat,
        spf.lng,
        spf.lng
      ];
      const { rows } = await client.query(insertSQL, values);
      inserted.push({
        spf: spf.code,
        categoria: r.categoria,
        record: rows[0]
      });
    }
  }

  console.log(`🌱 Total de subparcelas creadas: ${inserted.length}`);
  return inserted;
}

// =========================================================
// 📋 LISTAR Y OBTENER CONGLOMERADOS
// =========================================================
async function listarConglomerados() {
  console.log('📋 Listando todos los conglomerados registrados...');
  const { rows } = await pool.query('SELECT * FROM listar_conglomerados()');
  console.log(`✅ ${rows.length} conglomerado(s) encontrados.`);
  return rows;
}

async function obtenerConglomeradoPorId(id) {
  console.log(`🔍 Buscando conglomerado con ID: ${id}`);

  // ✅ Usar función SQL que ya funciona
  const { rows } = await pool.query(
    'SELECT * FROM obtener_conglomerado_por_id($1)',
    [id]
  );

  if (rows.length === 0) return null;

  const cong = rows[0];

  const subs = await pool.query(
    'SELECT * FROM listar_subparcelas_por_conglomerado($1)',
    [id]
  );

  return {
    conglomerado: cong, 
    subparcelas: subs.rows
  };
}



// =========================================================
// 📦 EXPORTAR FUNCIONES
// =========================================================
module.exports = {
  crearConglomeradoManual,
  crearConglomeradosAutomatico,
  listarConglomerados,
  obtenerConglomeradoPorId
};
