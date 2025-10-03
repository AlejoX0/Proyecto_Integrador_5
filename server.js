const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/auth', authRoutes);

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/login', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Conectado a MongoDB");
  app.listen(3000, () => console.log("🚀 Servidor corriendo en http://localhost:3000"));
})
.catch(err => console.error("❌ Error al conectar MongoDB:", err));
