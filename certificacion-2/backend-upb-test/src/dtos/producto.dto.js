const HttpError = require('../utils/http-error');

// Valida y filtra lo que manda el cliente; solo deja pasar los campos permitidos
// Límites de las columnas: precio NUMERIC(10,2) y stock INTEGER. Pasarse provocaría un error de la BD (500)
const PRECIO_MAXIMO = 99999999.99;
const STOCK_MAXIMO = 2147483647;

const validarCampos = (body, { parcial }) => {
    const errores = [];
    const datos = {};
    const { nombre, precio, stock } = body || {};

    if (nombre !== undefined) {
        if (typeof nombre !== 'string' || nombre.trim() === '') errores.push('"nombre" debe ser un texto no vacío');
        else if (nombre.length > 100) errores.push('"nombre" no puede superar 100 caracteres');
        else if (nombre.includes('\u0000')) errores.push('"nombre" contiene caracteres no permitidos');
        else datos.nombre = nombre.trim();
    } else if (!parcial) {
        errores.push('"nombre" es obligatorio');
    }

    if (precio !== undefined) {
        if (typeof precio !== 'number' || !Number.isFinite(precio) || precio < 0 || precio > PRECIO_MAXIMO) {
            errores.push(`"precio" debe ser un número entre 0 y ${PRECIO_MAXIMO}`);
        } else datos.precio = precio;
    } else if (!parcial) {
        datos.precio = 0;
    }

    if (stock !== undefined) {
        if (!Number.isInteger(stock) || stock < 0 || stock > STOCK_MAXIMO) {
            errores.push(`"stock" debe ser un entero entre 0 y ${STOCK_MAXIMO}`);
        } else datos.stock = stock;
    } else if (!parcial) {
        datos.stock = 0;
    }

    if (parcial && Object.keys(datos).length === 0 && errores.length === 0) {
        errores.push('Debes enviar al menos un campo: nombre, precio o stock');
    }

    if (errores.length > 0) throw new HttpError(400, errores.join(', '));
    return datos;
};

// DTO de entrada para POST
const crearProductoDto = (body) => validarCampos(body, { parcial: false });

// DTO de entrada para PUT (todos los campos opcionales)
const actualizarProductoDto = (body) => validarCampos(body, { parcial: true });

// DTO de salida: lo que la API devuelve al cliente
const productoResponseDto = (producto) => ({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    stock: producto.stock,
    createdAt: producto.createdAt,
});

module.exports = { crearProductoDto, actualizarProductoDto, productoResponseDto };
