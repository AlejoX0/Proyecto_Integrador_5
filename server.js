// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Rutas
const authRoutes = require('./routes/authRoutes');
const brigadasRoutes = require('./routes/brigadasRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/brigadas', brigadasRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_integrador', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
  app.listen(process.env.PORT || 3000, () => {
    console.log('🚀 Servidor corriendo en http://localhost:3000');
  });
})
.catch(err => console.error('❌ Error al conectar MongoDB:', err));
