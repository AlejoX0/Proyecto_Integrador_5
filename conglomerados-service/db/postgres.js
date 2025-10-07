import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("connect", () => {
  console.log("✅ Conectado correctamente a PostgreSQL (Neon)");
});

pool.on("error", (err) => {
  console.error("❌ Error en la conexión a PostgreSQL:", err.message);
});

export default pool;
