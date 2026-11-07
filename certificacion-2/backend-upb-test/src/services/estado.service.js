const estadoRepository = require('../repositories/estado.repository');

const iniciadoEn = new Date();

// Render define RENDER_GIT_COMMIT con el commit que desplegó; en local no existe
const commit = () => (process.env.RENDER_GIT_COMMIT || 'local').slice(0, 7);

const obtener = async () => {
    let baseDeDatos = 'conectada';
    try {
        await estadoRepository.ping();
    } catch (err) {
        console.error('Health check: la base de datos no responde:', err.message);
        baseDeDatos = 'sin conexion';
    }

    return {
        servicio: 'backendUpb',
        estado: baseDeDatos === 'conectada' ? 'ok' : 'degradado',
        baseDeDatos,
        commit: commit(),
        iniciadoEn: iniciadoEn.toISOString(),
        uptimeSegundos: Math.round(process.uptime()),
    };
};

module.exports = { obtener };
