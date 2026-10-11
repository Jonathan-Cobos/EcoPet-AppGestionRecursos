const express = require('express');
const cors = require('cors');

const usuariosRoutes = require('./routes/usuarios.routes');
const registrosRoutes = require('./routes/registros.routes');
const mascotaRoutes = require('./routes/mascota.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/registros', registrosRoutes);
app.use('/api/mascota', mascotaRoutes);

// Salud del servicio
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores general
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

module.exports = app;
