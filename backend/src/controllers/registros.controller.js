const registroModel = require('../models/registro.model');
const consumoService = require('../services/consumo.service');

async function crear(req, res, next) {
  try {
    const { usuarioId, tipoServicio, valor, periodo } = req.body;

    if (!usuarioId || !['agua', 'luz'].includes(tipoServicio) || valor == null || !periodo) {
      return res.status(400).json({ error: 'usuarioId, tipoServicio, valor y periodo son obligatorios' });
    }

    const resultado = await consumoService.registrarConsumo({ usuarioId, tipoServicio, valor, periodo });
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
}

async function listarPorUsuario(req, res, next) {
  try {
    const { usuarioId, tipoServicio } = req.query;
    if (!usuarioId || !['agua', 'luz'].includes(tipoServicio)) {
      return res.status(400).json({ error: 'usuarioId y tipoServicio son obligatorios como query params' });
    }
    const registros = await registroModel.listarPorUsuario(usuarioId, tipoServicio);
    res.json(registros);
  } catch (error) {
    next(error);
  }
}

module.exports = { crear, listarPorUsuario };
