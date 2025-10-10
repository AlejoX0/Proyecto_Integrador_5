// ====================================================
// CONTROLADOR DE AUTENTICACIÓN Y USUARIOS
// ====================================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/User");
const Session = require("../models/Session");
const { sincronizarUsuario } = require("../services/usersService");

const JWT_SECRET = process.env.JWT_SECRET || "proyectoIntegrador5";

// ====================================================
// 👤 CU1 - Registrar usuario (solo administrador)
// ====================================================
async function registrarUsuario(req, res) {
  try {
    // 🛡️ Verificar rol administrador
    if (!req.user || req.user.rol !== "administrador") {
      return res
        .status(403)
        .json({ error: "Acceso denegado: solo el administrador puede registrar usuarios" });
    }

    const { nro_documento, nombre, apellido, correo, telefono, password, rol } = req.body;

    if (!nro_documento || !nombre || !apellido || !correo || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // 📋 Verificar si ya existe
    const existe = await Usuario.findOne({
      $or: [{ correo }, { nro_documento }],
    });
    if (existe) return res.status(400).json({ error: "El usuario ya está registrado" });

    // 🔑 Encriptar contraseña
    const hashed = await bcrypt.hash(password, 10);

    // 🧩 Crear usuario en MongoDB
    const nuevoUsuario = new Usuario({
      nro_documento,
      nombre,
      apellido,
      correo,
      telefono,
      password: hashed,
      rol: rol || "auxiliar de campo",
    });

    await nuevoUsuario.save();

    // 🔁 Sincronizar con PostgreSQL (brigadas-service)
    await sincronizarUsuario(nuevoUsuario);

    res.json({
      mensaje: "✅ Usuario registrado exitosamente",
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (err) {
    console.error("❌ Error en registro:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
}

// ====================================================
// 🔐 CU2 - Login de usuario (todos los roles)
// ====================================================
async function loginUsuario(req, res) {
  try {
    const { correo, password } = req.body;

    // 🔍 Buscar usuario en Mongo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    // 🔑 Verificar contraseña
    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) return res.status(401).json({ error: "Contraseña incorrecta" });

    // 🎟️ Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol, correo: usuario.correo },
      JWT_SECRET,
      { expiresIn: "4h" }
    );

    // 💾 Guardar sesión
    await Session.create({ userId: usuario._id, token });

    res.json({
      mensaje: "✅ Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
}

module.exports = { registrarUsuario, loginUsuario };
