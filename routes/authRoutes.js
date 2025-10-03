const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// 🔑 Clave secreta para JWT
const JWT_SECRET = "proyectoIntegrador5";

// 📋 Modelo de Usuario
const usuarioSchema = new mongoose.Schema({
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

// 📝 Registro
router.post("/register", async (req, res) => {
  try {
    const { correo, password } = req.body;

    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({ correo, password: hashedPassword });
    await nuevoUsuario.save();

    res.json({ mensaje: "Usuario registrado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// 🔐 Login
router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ mensaje: "Login exitoso", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
