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
    if (!req.user || req.user.rol !== "administrador") {
      return res.status(403).json({ error: "Acceso denegado: solo el administrador puede registrar usuarios" });
    }

    const { nro_documento, nombre, apellido, correo, telefono, password, rol, departamento } = req.body;

    if (!nro_documento || !nombre || !apellido || !correo || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const existe = await Usuario.findOne({ $or: [{ correo }, { nro_documento }] });
    if (existe) return res.status(400).json({ error: "El usuario ya está registrado" });

    const hashed = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nro_documento,
      nombre,
      apellido,
      correo,
      telefono,
      password: hashed,
      rol: rol || "auxiliar de campo",
      departamento, // 👈 Nuevo campo agregado
    });

    await nuevoUsuario.save();
    await sincronizarUsuario(nuevoUsuario);

    res.json({
      mensaje: "✅ Usuario registrado exitosamente",
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
        departamento: nuevoUsuario.departamento, // 👈 Opcional, si quieres devolverlo
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

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol, correo: usuario.correo },
      JWT_SECRET,
      { expiresIn: "4h" }
    );

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

// ====================================================
// 🚨 CREAR PRIMER ADMINISTRADOR (ruta temporal)
// ====================================================
async function crearPrimerAdmin(req, res) {
  try {
    const { nombre, apellido, correo, nro_documento, telefono, password } = req.body;

    if (!nombre || !apellido || !correo || !nro_documento || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const existeAdmin = await Usuario.findOne({ rol: "administrador" });
    if (existeAdmin) {
      return res.status(400).json({ error: "Ya existe un administrador registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoAdmin = new Usuario({
      nombre,
      apellido,
      correo,
      nro_documento,
      telefono,
      password: hashedPassword,
      rol: "administrador",
    });

    await nuevoAdmin.save();

    res.status(201).json({
      mensaje: "✅ Administrador creado exitosamente",
      admin: {
        nombre: nuevoAdmin.nombre,
        correo: nuevoAdmin.correo,
        rol: nuevoAdmin.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error al crear el administrador:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = { registrarUsuario, loginUsuario, crearPrimerAdmin };
