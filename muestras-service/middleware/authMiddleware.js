const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// 🧩 Mapa de roles abreviados → nombres oficiales del IFN
const roleMap = {
  Jefe: "jefe de brigada",
  Lider: "jefe de brigada",
  Botanico: "botanico",
  Auxiliar: "auxiliar de campo",
  Admin: "administrador",
  Todos: "todos"
};

// 🔐 Middleware para verificar token y rol
function verificarRol(rolesPermitidos = []) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ error: "Token no proporcionado" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // 🔄 Convertir rol del token al nombre oficial (si existe en el mapa)
      const rolOficial = roleMap[decoded.rol] || decoded.rol;
      req.user.rolOficial = rolOficial;

      // 🧠 Validar permisos con el nombre oficial
      const rolesDB = rolesPermitidos.map(r => roleMap[r] || r);

      if (!rolesDB.includes(rolOficial) && !rolesDB.includes("Todos")) {
        return res.status(403).json({ error: "No tienes permisos suficientes" });
      }

      next();
    } catch (err) {
      console.error("Error en autenticación:", err.message);
      res.status(401).json({ error: "Token inválido o expirado" });
    }
  };
}

module.exports = { verificarRol };
