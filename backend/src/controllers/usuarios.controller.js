const crypto = require('crypto');
const usuarioModel = require('../models/usuario.model');
const estandarModel = require('../models/estandar.model');

// Hash simple de contraseña (reemplazar por bcrypt en una siguiente iteración)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function crear(req, res, next) {
  try {
    const { nombre, email, password, tipoVivienda, areaM2, habitaciones, banos, habitantes } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'nombre, email y password son obligatorios' });
    }

    const passwordHash = hashPassword(password);
    const id = await usuarioModel.crear({
      nombre, email, passwordHash, tipoVivienda, areaM2, habitaciones, banos, habitantes,
    });

    res.status(201).json({ id, nombre, email });
  } catch (error) {
    next(error);
  }
}

async function obtener(req, res, next) {
  try {
    const usuario = await usuarioModel.obtenerPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

async function listar(req, res, next) {
  try {
    const usuarios = await usuarioModel.listar();
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

// Define o actualiza el estándar de consumo (agua/luz) para un usuario
async function establecerEstandar(req, res, next) {
  try {
    const { tipoServicio, valorEstandar, unidad } = req.body;
    if (!['agua', 'luz'].includes(tipoServicio) || valorEstandar == null || !unidad) {
      return res.status(400).json({ error: 'tipoServicio, valorEstandar y unidad son obligatorios' });
    }
    await estandarModel.establecer({
      usuarioId: req.params.id, tipoServicio, valorEstandar, unidad,
    });
    res.status(200).json({ ok: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { crear, obtener, listar, establecerEstandar };
