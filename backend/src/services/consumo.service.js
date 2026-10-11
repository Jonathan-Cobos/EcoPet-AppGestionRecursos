const registroModel = require('../models/registro.model');
const estandarModel = require('../models/estandar.model');
const mascotaModel = require('../models/mascota.model');
const alertaModel = require('../models/alerta.model');

// Umbral de aumento súbito (%) que dispara la alerta preventiva de fuga
const UMBRAL_ALERTA_FUGA = 60;

/**
 * Registra un nuevo consumo, compara contra el registro anterior y el
 * estándar, actualiza el estado de la mascota y genera alerta si aplica.
 */
async function registrarConsumo({ usuarioId, tipoServicio, valor, periodo }) {
  const registroId = await registroModel.crear({ usuarioId, tipoServicio, valor, periodo });

  const anterior = await registroModel.obtenerAnterior(usuarioId, tipoServicio, periodo);
  const estandar = await estandarModel.obtener(usuarioId, tipoServicio);

  let variacionPorc = null;
  if (anterior && Number(anterior.valor) > 0) {
    variacionPorc = ((valor - anterior.valor) / anterior.valor) * 100;
  }

  // 1) Estado de la mascota: según la variación contra el registro anterior
  let estadoMascota = 'neutral';
  if (variacionPorc !== null) {
    if (variacionPorc <= 0) {
      estadoMascota = 'feliz';
    } else if (variacionPorc > 0 && estandar && valor > estandar.valor_estandar) {
      estadoMascota = 'decaido';
    } else if (variacionPorc > 0) {
      estadoMascota = 'neutral';
    }
  }
  await mascotaModel.actualizarEstado(usuarioId, tipoServicio, estadoMascota);

  // 2) ¿Excede el estándar? -> se debe disparar el cuestionario de hábitos
  const excedeEstandar = Boolean(estandar && valor > estandar.valor_estandar);

  // 3) ¿Aumento muy fuerte y repentino? -> alerta preventiva de posible fuga
  let alerta = null;
  if (variacionPorc !== null && variacionPorc >= UMBRAL_ALERTA_FUGA) {
    const mensaje = `Aumento del ${variacionPorc.toFixed(1)}% respecto al periodo anterior. Posible fuga.`;
    const alertaId = await alertaModel.crear({ usuarioId, tipoServicio, registroId, mensaje });
    alerta = { id: alertaId, mensaje };
  }

  return {
    registroId,
    variacionPorc,
    estadoMascota,
    excedeEstandar,
    alerta,
  };
}

module.exports = { registrarConsumo, UMBRAL_ALERTA_FUGA };
