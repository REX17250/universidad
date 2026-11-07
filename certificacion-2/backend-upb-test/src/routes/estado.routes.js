const { Router } = require('express');
const estadoController = require('../controllers/estado.controller');

const router = Router();

router.get('/', estadoController.obtener);

module.exports = router;
