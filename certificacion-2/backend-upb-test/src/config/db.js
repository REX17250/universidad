require('dotenv').config();
const { Pool } = require('pg');

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   ssl: process.env.DB_SSL === 'true',
//   password: process.env.DB_PASSWORD,
// });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Render corta las conexiones inactivas; sin este manejador ese error tumba todo el proceso
pool.on('error', (err) => {
    console.error('Error inesperado en una conexión inactiva del pool:', err.message);
});

module.exports = pool;