// generarToken.js
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  {
    id_usuario: 1,
    nombre: "Administrador General",
    rol: "administrador"  // Usa el mismo rol que espera tu middleware
  },
  "brigadas_secret_key_IFN_2025", // ✅ Clave secreta correcta del servicio brigadas
  { expiresIn: "1d" } // Token válido por 1 día
);

console.log("\n🔐 Token generado correctamente:\n");
console.log(token);
