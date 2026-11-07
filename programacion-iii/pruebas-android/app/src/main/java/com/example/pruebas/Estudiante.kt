package com.example.pruebas

data class Estudiante(
    val primerNombre: String,
    val valSegundoNombre: String?,
    val apellidoPaterno: String,
    val apellidoMaterno: String,
    val codigo: Int,
    var edad: Int,
    var semestre: Int
)

fun Estudiante.esUnSemestreAvanzado(): Boolean {
    return this.semestre >= 6
}

fun Estudiante.actualizarSemestre(nuevoSemestre: Int) {
    this.semestre = nuevoSemestre
}

fun Estudiante.nombreCompleto(): String {
    return this.primerNombre + " " + this.valSegundoNombre + " " + this.apellidoPaterno + " " + this.apellidoMaterno
}
