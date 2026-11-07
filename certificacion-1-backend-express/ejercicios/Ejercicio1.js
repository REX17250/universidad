//Filtrar productos disponibles
function filterAvailable(products){
    return products.filter(product => product.disponible === true)
}

const products = [
  { nombre: "Laptop", precio: 4500, disponible: true },
  { nombre: "Mouse", precio: 80, disponible: false },
  { nombre: "Teclado", precio: 150, disponible: true }
];

console.log(filterAvailable(products));