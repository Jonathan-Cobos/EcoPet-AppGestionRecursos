const pool = require('../config/db');

async function crear({ nombre, email, passwordHash, tipoVivienda, areaM2, habitaciones, banos, habitantes }) {
  const [result] = await pool.query(
    `INSERT INTO usuarios (nombre, email, password_hash, tipo_vivienda, area_m2, habitaciones, banos, habitantes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, email, passwordHash, tipoVivienda, areaM2, habitaciones, banos, habitantes]
  );
  return result.insertId;
}

async function obtenerPorId(id) {
  const [rows] = await pool.query(
    `SELECT id, nombre, email, tipo_vivienda, area_m2, habitaciones, banos, habitantes, creado_en
     FROM usuarios WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function listar() {
  const [rows] = await pool.query(
    `SELECT id, nombre, email, tipo_vivienda, area_m2, habitaciones, banos, habitantes, creado_en
     FROM usuarios ORDER BY id DESC`
  );
  return rows;
}

module.exports = { crear, obtenerPorId, listar };
