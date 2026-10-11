const pool = require('../config/db');

async function obtener(usuarioId, tipoServicio) {
  const [rows] = await pool.query(
    `SELECT valor_estandar, unidad FROM estandares
     WHERE usuario_id = ? AND tipo_servicio = ?`,
    [usuarioId, tipoServicio]
  );
  return rows[0] || null;
}

async function establecer({ usuarioId, tipoServicio, valorEstandar, unidad }) {
  await pool.query(
    `INSERT INTO estandares (usuario_id, tipo_servicio, valor_estandar, unidad)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE valor_estandar = VALUES(valor_estandar), unidad = VALUES(unidad)`,
    [usuarioId, tipoServicio, valorEstandar, unidad]
  );
}

module.exports = { obtener, establecer };
