abstract class Animal:
    def sonido: String

class Perro extends Animal:
    def sonido = "Guau"

class Gato extends Animal:
    def sonido = "Miau"

class Piedra

def hacerSonar[A <: Animal] (a: A): Unit =
    println(a.sonido)

hacerSonar(new Perro)
hacerSonar(new piedra)


