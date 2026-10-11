const express = require('express');
const controller = require('../controllers/usuarios.controller');

const router = express.Router();

router.post('/', controller.crear);
router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.put('/:id/estandar', controller.establecerEstandar);

module.exports = router;
