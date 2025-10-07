const jwt = require('jsonwebtoken');

const token = jwt.sign(
  {
    id_usuario: 1,
    nombre: "Administrador General",
    rol: "admin"
  },
  "conglomerados_secret_key_IFN_2025",
  { expiresIn: "1d" }
);

console.log("\n🔐 Token generado:\n");
console.log(token);
