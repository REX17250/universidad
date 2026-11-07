//Sistema de calificaciones con funciones
const estudiantes = [
  { nombre: "Ana", notas: [80, 90, 75] },
  { nombre: "Luis", notas: [50, 60, 58] },
  { nombre: "Carla", notas: [95, 92, 98] },
  { nombre: "Pedro", notas: [40, 45, 50] }
];
function calcularPromedio(notas){
    let suma = 0;
    notas.forEach(element => {
        suma += element;
    });
    return suma / notas.length;
}
function obtenerEstado(promedio){
    if (promedio >=60)return "Aprobado";
    else return "Reprobado";
}
function generarReporte(estudiantes){
    nuevaLista = [];
    estudiantes.forEach(element => {
        let promedio = calcularPromedio(element.notas);
        let estado = obtenerEstado(promedio);
        nuevaLista.push({ nombre: element.nombre, promedio: promedio.toFixed(2), estado: estado });
    });
    return nuevaLista;
}

console.log(generarReporte(estudiantes));