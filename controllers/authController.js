// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

exports.registrar = async (req, res) => {
  try {
    const { nro_documento, nombre, apellido, correo, telefono, password, rol } = req.body;
    if (!nro_documento || !nombre || !apellido || !correo || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Normalizar correo
    const correoNormal = correo.trim().toLowerCase();

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nro_documento,
      nombre,
      apellido,
      correo: correoNormal,
      telefono,
      password: hashedPassword,
      rol
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: "Usuario registrado con éxito" });
  } catch (error) {
    // Manejo básico de errores (ej. duplicados)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Correo o nro_documento ya registrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) return res.status(400).json({ error: "correo y password requeridos" });

    const correoNormal = correo.trim().toLowerCase();
    const usuario = await Usuario.findOne({ correo: correoNormal });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ error: "Credenciales incorrectas" });

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol, nro_documento: usuario.nro_documento },
      process.env.JWT_SECRET || 'proyectoIntegrador5',
      { expiresIn: '1h' }
    );

    res.json({ mensaje: "Login exitoso", token, rol: usuario.rol, nro_documento: usuario.nro_documento });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
