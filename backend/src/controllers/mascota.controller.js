const mascotaModel = require('../models/mascota.model');

async function obtenerEstado(req, res, next) {
  try {
    const { usuarioId, tipoServicio } = req.query;
    if (!usuarioId || !['agua', 'luz'].includes(tipoServicio)) {
      return res.status(400).json({ error: 'usuarioId y tipoServicio son obligatorios como query params' });
    }
    const estado = await mascotaModel.obtenerEstado(usuarioId, tipoServicio);
    res.json(estado || { estado: 'neutral', actualizado_en: null });
  } catch (error) {
    next(error);
  }
}

module.exports = { obtenerEstado };
