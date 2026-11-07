//Generar reporte de inventario crítico
function generarReporteInventarioCritico(productos){
    //return de nombre stock stock minimo valor faltante
    return productos.filter(producto => producto.stock <= producto.stockMinimo)
                    .map(producto => ({nombre: producto.nombre,
                                       stock: producto.stock,
                                       stockMinimo: producto.stockMinimo,
                                       valorFaltante: (producto.stockMinimo - producto.stock) * producto.precio
                    }))
                    .sort((a,b)=>b.valorFaltante-a.valorFaltante)

}


const productos = [
  { nombre: "Laptop", stock: 2, stockMinimo: 5, precio: 5000 },
  { nombre: "Mouse", stock: 10, stockMinimo: 5, precio: 100 },
  { nombre: "Teclado", stock: 3, stockMinimo: 3, precio: 200 },
  { nombre: "Monitor", stock: 1, stockMinimo: 4, precio: 900 }
];

console.log(generarReporteInventarioCritico(productos));