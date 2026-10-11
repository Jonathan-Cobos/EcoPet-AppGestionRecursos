const express = require('express');
const controller = require('../controllers/mascota.controller');

const router = express.Router();

router.get('/', controller.obtenerEstado);

module.exports = router;
