const estadoService = require('../services/estado.service');

// 200 si todo está bien; 503 (no 500) si la base de datos no responde
const obtener = async (req, res) => {
    const estado = await estadoService.obtener();
    res.status(estado.estado === 'ok' ? 200 : 503).json(estado);
};

module.exports = { obtener };
