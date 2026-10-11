const pool = require('../config/db');

async function crear({ usuarioId, tipoServicio, registroId, mensaje }) {
  const [result] = await pool.query(
    `INSERT INTO alertas (usuario_id, tipo_servicio, registro_id, mensaje)
     VALUES (?, ?, ?, ?)`,
    [usuarioId, tipoServicio, registroId, mensaje]
  );
  return result.insertId;
}

module.exports = { crear };
