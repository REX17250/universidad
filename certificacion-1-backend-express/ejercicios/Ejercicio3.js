//Aplicar descuento a productos de una categoría
function aplicarDescuentoPorCategoria(productos, categoria, descuento){
    return productos.map(producto => ({
        nombre: producto.nombre, 
        precio: producto.categoria === categoria
        ? producto.precio*(1-descuento/100)
        : producto.precio,
        categoria: producto.categoria
    }));
}

const productos = [
  { nombre: "Laptop", precio: 5000, categoria: "tecnologia" },
  { nombre: "Camisa", precio: 200, categoria: "ropa" },
  { nombre: "Mouse", precio: 100, categoria: "tecnologia" }
];

console.log(aplicarDescuentoPorCategoria(productos, "tecnologia", 10));