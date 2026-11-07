require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

pool.query(sql)
    .then(() => console.log('Tabla "productos" creada ✅'))
    .catch((err) => console.error('Error al crear la tabla ❌', err.message))
    .finally(() => pool.end());
