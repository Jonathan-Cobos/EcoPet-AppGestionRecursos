const pool = require('../config/db');

async function obtenerEstado(usuarioId, tipoServicio) {
  const [rows] = await pool.query(
    `SELECT estado, actualizado_en FROM mascota_estado
     WHERE usuario_id = ? AND tipo_servicio = ?`,
    [usuarioId, tipoServicio]
  );
  return rows[0] || null;
}

async function actualizarEstado(usuarioId, tipoServicio, estado) {
  await pool.query(
    `INSERT INTO mascota_estado (usuario_id, tipo_servicio, estado)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE estado = VALUES(estado), actualizado_en = CURRENT_TIMESTAMP`,
    [usuarioId, tipoServicio, estado]
  );
}

module.exports = { obtenerEstado, actualizarEstado };
