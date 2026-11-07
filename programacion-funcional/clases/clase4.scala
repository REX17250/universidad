//FUNCIONES QUE RETORNAN FUNCIONES
//Funcion simple
def sumar(a: Int, b: Int): Int

//Funcion que devuelve una funcion
def makeAdder(n: Int): Int => Int =
    (x: Int) => x + n

val add5 = makeAdder(5)
println(add5(10))

//ejercicio
def saludo(nombre: String): String => String =
    (ciudad: String) => s"hola $nombre desde $ciudad"

val addNombre = saludo("Diego")
print(addNombre("La Paz"))

//ejercicio
def imparPor10(mul: Int): List[Int] => List[Int] =
    (lista: List[Int]) => lista.filter(_%2!=0).map(_*mul)

val addMul = imparPor10(multiplo)
print(addMul(nums))
