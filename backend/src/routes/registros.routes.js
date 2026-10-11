const express = require('express');
const controller = require('../controllers/registros.controller');

const router = express.Router();

router.post('/', controller.crear);
router.get('/', controller.listarPorUsuario);

module.exports = router;
