require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Verifica la conexión a MySQL antes de levantar el servidor
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('Conexión a MySQL establecida correctamente.');

    app.listen(PORT, () => {
      console.log(`Servidor EcoPet escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No fue posible conectar a MySQL:', error.message);
    process.exit(1);
  }
}

start();
