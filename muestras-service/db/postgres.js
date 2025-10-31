const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("connect", () => {
  console.log("✅ Conectado correctamente a la base de datos PostgreSQL (Neon).");
});

pool.on("error", (err) => {
  console.error("❌ Error en la conexión a PostgreSQL:", err.message);
});

// Auto-cargar funciones SQL
(async () => {
  try {
    const dbDir = path.join(__dirname);
    const sqlFiles = fs.readdirSync(dbDir).filter(f => f.endsWith(".sql"));

    for (const file of sqlFiles) {
      const filePath = path.join(dbDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");
      await pool.query(sql);
      console.log(`✅ Funciones cargadas desde ${file}`);
    }
  } catch (err) {
    console.error("⚠️ Error cargando funciones SQL:", err.message);
  }
})();

module.exports = pool;
