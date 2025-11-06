// ====================================================
// CONTROLADOR DE AUTENTICACIÓN Y USUARIOS (con auditoría)
// ====================================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Usuario = require("../models/User");
const Session = require("../models/Session");
const Auditoria = require("../models/Auditoria");
const {
  sincronizarUsuario,
  actualizarUsuario: syncActualizarUsuario,
  eliminarUsuarioPostgres,
} = require("../services/usersService");

const JWT_SECRET = process.env.JWT_SECRET || "proyectoIntegrador5";

// ====================================================
// 📋 FUNCIÓN PARA REGISTRAR ACCIONES EN AUDITORÍA
// ====================================================
async function registrarAuditoria(admin, accion, usuario_afectado, detalle = "") {
  try {
    await Auditoria.create({
      accion,
      usuario_afectado,
      admin_id: admin.id,
      admin_correo: admin.correo,
      detalle,
    });
  } catch (err) {
    console.error("⚠️ Error al registrar auditoría:", err.message);
  }
}


// ====================================================
// 👤 CU1 - Registrar usuario (solo administrador)
// ====================================================
async function registrarUsuario(req, res) {
  try {
    if (!req.user || req.user.rol !== "administrador") {
      return res
        .status(403)
        .json({ error: "Acceso denegado: solo el administrador puede registrar usuarios" });
    }

    const { nro_documento, nombre, apellido, correo, telefono, password, rol, departamento } =
      req.body;

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
      departamento,
    });

    await nuevoUsuario.save();
    await sincronizarUsuario(nuevoUsuario);

    await registrarAuditoria(
      req.user,
      "CREAR_USUARIO",
      nuevoUsuario._id,
      `Usuario ${nuevoUsuario.correo} creado correctamente`
    );

    res.json({
      mensaje: "✅ Usuario registrado exitosamente",
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
        departamento: nuevoUsuario.departamento,
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

    await registrarAuditoria(
      { id: usuario._id, correo: usuario.correo },
      "LOGIN",
      usuario._id,
      "Inicio de sesión exitoso"
    );

    res.json({
      mensaje: "✅ Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol,
        departamento: usuario.departamento,
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

// ====================================================
// 🔍 Función auxiliar: Buscar por _id o nro_documento
// ====================================================
async function obtenerUsuarioFlexible(id) {
  let usuario = null;

  if (mongoose.Types.ObjectId.isValid(id)) {
    usuario = await Usuario.findById(id);
  }

  if (!usuario) {
    usuario = await Usuario.findOne({ nro_documento: id });
  }

  return usuario;
}

// ====================================================
// ✏️ Actualizar usuario (solo administrador)
// ====================================================
async function actualizarUsuario(req, res) {
  try {
    if (!req.user || req.user.rol !== "administrador") {
      return res
        .status(403)
        .json({ error: "Acceso denegado: solo el administrador puede actualizar usuarios" });
    }

    const { id } = req.params;
    const { nombre, apellido, correo, telefono, rol, departamento } = req.body;

    const usuario = await obtenerUsuarioFlexible(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    if (nombre) usuario.nombre = nombre;
    if (apellido) usuario.apellido = apellido;
    if (correo) usuario.correo = correo;
    if (telefono) usuario.telefono = telefono;
    if (rol) usuario.rol = rol;
    if (departamento) usuario.departamento = departamento;

    await usuario.save();
    await syncActualizarUsuario(usuario);

    await registrarAuditoria(
      req.user,
      "ACTUALIZAR_USUARIO",
      usuario._id,
      `Usuario ${usuario.correo} actualizado`
    );

    res.json({ mensaje: "✅ Usuario actualizado correctamente", usuario });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ====================================================
// ❌ Eliminar usuario (solo administrador)
// ====================================================
async function eliminarUsuario(req, res) {
  try {
    if (!req.user || req.user.rol !== "administrador") {
      return res.status(403).json({ error: "Acceso denegado: solo el administrador puede eliminar usuarios" });
    }

    const { id } = req.params;
    const usuario = await obtenerUsuarioFlexible(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    await Usuario.deleteOne({ _id: usuario._id });
    await eliminarUsuarioPostgres(usuario._id, usuario.nro_documento);

    await registrarAuditoria(
      req.user,
      "ELIMINAR_USUARIO",
      usuario._id,
      `Usuario ${usuario.correo} eliminado`
    );

    res.json({ mensaje: "🗑️ Usuario eliminado correctamente de Mongo y Postgres" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ====================================================
// 🧩 Filtrar usuarios por departamento y rol (solo admin)
// ====================================================
async function filtrarUsuarios(req, res) {
  try {
    if (!req.user || req.user.rol !== "administrador") {
      return res
        .status(403)
        .json({ error: "Acceso denegado: solo el administrador puede filtrar usuarios" });
    }

    const { departamento, rol } = req.query;
    const filtro = {};

    if (departamento) filtro.departamento = departamento;
    if (rol) filtro.rol = rol;

    const usuarios = await Usuario.find(filtro);

    await registrarAuditoria(
      req.user,
      "FILTRAR_USUARIOS",
      null,
      `Filtro aplicado: departamento=${departamento || "todos"}, rol=${rol || "todos"}`
    );

    res.json({
      mensaje: "✅ Usuarios filtrados correctamente",
      total: usuarios.length,
      usuarios,
    });
  } catch (error) {
    console.error("❌ Error al filtrar usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ====================================================
// 📜 Obtener registros de auditoría (solo administrador)
// ====================================================
async function obtenerAuditorias(req, res) {
  try {
    if (!req.user || req.user.rol !== "administrador") {
      return res
        .status(403)
        .json({ error: "Acceso denegado: solo el administrador puede ver auditorías" });
    }

    const auditorias = await Auditoria.find().sort({ fecha: -1 }).limit(100);

    res.json({
      mensaje: "✅ Registro de auditoría obtenido correctamente",
      total: auditorias.length,
      auditorias,
    });
  } catch (error) {
    console.error("❌ Error al obtener auditorías:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  registrarUsuario,
  loginUsuario,
  crearPrimerAdmin,
  actualizarUsuario,
  eliminarUsuario,
  filtrarUsuarios,
  obtenerAuditorias,
};
