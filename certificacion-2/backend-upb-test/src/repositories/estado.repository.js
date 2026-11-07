const pool = require('../config/db');

// Consulta mínima para saber si la base de datos responde
const ping = async () => {
    await pool.query('SELECT 1');
};

module.exports = { ping };
