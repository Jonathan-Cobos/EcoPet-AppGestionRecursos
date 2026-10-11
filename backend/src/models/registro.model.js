const pool = require('../config/db');

async function crear({ usuarioId, tipoServicio, valor, periodo }) {
  const [result] = await pool.query(
    `INSERT INTO registros_consumo (usuario_id, tipo_servicio, valor, periodo)
     VALUES (?, ?, ?, ?)`,
    [usuarioId, tipoServicio, valor, periodo]
  );
  return result.insertId;
}

async function listarPorUsuario(usuarioId, tipoServicio) {
  const [rows] = await pool.query(
    `SELECT id, tipo_servicio, valor, periodo, creado_en
     FROM registros_consumo
     WHERE usuario_id = ? AND tipo_servicio = ?
     ORDER BY periodo DESC`,
    [usuarioId, tipoServicio]
  );
  return rows;
}

// Trae el registro inmediatamente anterior al periodo recién insertado,
// para poder comparar y decidir el estado de la mascota / alerta de fuga.
async function obtenerAnterior(usuarioId, tipoServicio, periodo) {
  const [rows] = await pool.query(
    `SELECT id, valor, periodo
     FROM registros_consumo
     WHERE usuario_id = ? AND tipo_servicio = ? AND periodo < ?
     ORDER BY periodo DESC
     LIMIT 1`,
    [usuarioId, tipoServicio, periodo]
  );
  return rows[0] || null;
}

module.exports = { crear, listarPorUsuario, obtenerAnterior };
