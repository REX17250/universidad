const productoRepository = require('../repositories/producto.repository');
const HttpError = require('../utils/http-error');

// La columna id es SERIAL (INTEGER de 32 bits): un valor mayor haría fallar la consulta con un 500
const ID_MAXIMO = 2147483647;

const validarId = (id) => {
    const numero = Number(id);
    if (!Number.isInteger(numero) || numero <= 0 || numero > ID_MAXIMO) {
        throw new HttpError(400, 'El id debe ser un entero positivo');
    }
    return numero;
};

// Filtro opcional por nombre: ?nombre=texto (contiene, sin distinguir mayúsculas)
const listar = (nombre) => {
    if (nombre !== undefined && typeof nombre !== 'string') {
        throw new HttpError(400, '"nombre" debe ser un solo texto');
    }
    return productoRepository.findAll(nombre ? nombre.trim() : '');
};

const obtenerPorId = async (id) => {
    const producto = await productoRepository.findById(validarId(id));
    if (!producto) throw new HttpError(404, 'Producto no encontrado');
    return producto;
};

const crear = (datos) => productoRepository.create(datos);

// Actualización parcial: los campos que no se envían conservan su valor actual
const actualizar = async (id, datos) => {
    const actual = await obtenerPorId(id);
    return productoRepository.update(actual.id, {
        nombre: datos.nombre ?? actual.nombre,
        precio: datos.precio ?? actual.precio,
        stock: datos.stock ?? actual.stock,
    });
};

const eliminar = async (id) => {
    const eliminado = await productoRepository.remove(validarId(id));
    if (!eliminado) throw new HttpError(404, 'Producto no encontrado');
};

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
