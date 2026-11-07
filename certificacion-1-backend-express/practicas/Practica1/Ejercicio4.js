//Generador de IDs para registros de usuarios
function crearGeneradorDeIds(prefijo) {
    let contador = 0;
    return function() {
        contador++;
        return prefijo + "-" + contador;
    }
}

const generarIdUsuario = crearGeneradorDeIds("USR");

console.log(generarIdUsuario());
console.log(generarIdUsuario());
console.log(generarIdUsuario());

const generarIdProducto = crearGeneradorDeIds("PROD");

console.log(generarIdProducto());
console.log(generarIdProducto());

//Reto extra

function crearGeneradorDeIdsDesde(prefijo, numeroInicial) {
    let contador = numeroInicial;
    return function() {
        contador++;
        return prefijo + "-" + contador;
    }
}

const generarIdUsuarioDesde = crearGeneradorDeIdsDesde("USR", 100);

console.log(generarIdUsuarioDesde());
console.log(generarIdUsuarioDesde());
console.log(generarIdUsuarioDesde());

