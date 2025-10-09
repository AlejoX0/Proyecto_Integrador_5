// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const JWT_SECRET = process.env.JWT_SECRET || 'proyectoIntegrador5';

// Registro de usuario
exports.registrarUsuario = async (req, res) => {
  try {
    const { nro_documento, nombre, apellido, correo, telefono, password, rol } = req.body;

    if (!nro_documento || !nombre || !apellido || !correo || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const existeCorreo = await Usuario.findOne({ correo });
    const existeDoc = await Usuario.findOne({ nro_documento });
    if (existeCorreo || existeDoc) {
      return res.status(400).json({ error: 'El usuario ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({
      nro_documento,
      nombre,
      apellido,
      correo,
      telefono,
      password: hashedPassword,
      rol: rol || 'auxiliar de campo'
    });

    await nuevoUsuario.save();
    res.json({ mensaje: '✅ Usuario registrado exitosamente', usuario: nuevoUsuario });
  } catch (err) {
    console.error('❌ Error en registro:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Login de usuario
exports.loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) return res.status(400).json({ error: 'Usuario no encontrado' });

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol, correo: usuario.correo },
      JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.json({
      mensaje: '✅ Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        nro_documento: usuario.nro_documento,
        rol: usuario.rol
      }
    });
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
