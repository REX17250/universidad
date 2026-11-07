//Calculadora de descuentos inteligentes
function calcularPrecioFinal (precio, categoria, esClienteFrecuente){
    let precioAPagar = precio;
    if (categoria === "tecnologia"){
        precioAPagar *= 0.9;
    }else if (categoria === "ropa"){
        precioAPagar *= 0.85;
    }else if (categoria === "alimentos"){
        precioAPagar *= 0.95;
    }
    if(esClienteFrecuente)precioAPagar *= 0.95;   
    if(precioAPagar > 1000)precioAPagar -= 50;
    return precioAPagar;    
}

console.log(calcularPrecioFinal(1200, "tecnologia", true));