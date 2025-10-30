const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Rutas
app.use("/api/individuos", require("./routes/individuosRoutes"));
app.use("/api/especies", require("./routes/especiesRoutes"));

// Servidor
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`🚀 Microservicio Individuos-Especies activo en puerto ${PORT}`));
