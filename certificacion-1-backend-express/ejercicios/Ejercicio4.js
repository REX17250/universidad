//Resumen de ventas por vendedor
function calcularVentasPorVendedor(ventas){
    return ventas.reduce((acumulado, venta)  => {
        const nombre = venta.vendedor;
        acumulado[nombre] = (acumulado[nombre] || 0) + venta.monto
        return acumulado;
    },{})
}

const ventas = [
  { vendedor: "Ana", producto: "Laptop", monto: 5000 },
  { vendedor: "Luis", producto: "Mouse", monto: 100 },
  { vendedor: "Ana", producto: "Teclado", monto: 200 },
  { vendedor: "Luis", producto: "Monitor", monto: 900 }
];

console.log(calcularVentasPorVendedor(ventas));