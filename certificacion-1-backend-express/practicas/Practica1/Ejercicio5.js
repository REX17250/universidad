//Middleware simple para contar peticiones por usuario
function crearContadorDePeticiones(limite){
    let contador = 0;
        return function(){
            contador++;
            if(contador > limite){
               return "Límite excedido. Intenta más tarde.";
            }else{
                return "Petición permitida. Intento " + contador + " de " + limite;
            }
        }
}

const verificarPeticion = crearContadorDePeticiones(3);

console.log(verificarPeticion());
console.log(verificarPeticion());
console.log(verificarPeticion());
console.log(verificarPeticion());

//Reto extra
function crearContadorDePeticionesNombre(nombre, limite){
    let contador = 0;
        return function(){
            contador++;
            if(contador > limite){
               return "Límite excedido. Intenta más tarde.";
            }else{
                return nombre + ": petición permitida. Intento " + contador + " de " + limite;
            }
        }
}

const ana = crearContadorDePeticionesNombre("Ana", 3);
const luis = crearContadorDePeticionesNombre("Luis", 2);

console.log(ana());
console.log(ana());
console.log(luis());
console.log(ana());
console.log(luis());
console.log(luis());