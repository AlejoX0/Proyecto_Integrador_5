// server.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const conglomeradosRoutes = require('./routes/conglomeradosRoutes');
const subparcelasRoutes = require('./routes/subparcelasRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// prefijo de rutas
app.use('/api/conglomerados', conglomeradosRoutes);
app.use('/api/subparcelas', subparcelasRoutes);

// health
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'conglomerados' }));

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`🚀 Conglomerados service corriendo en puerto ${PORT}`));
