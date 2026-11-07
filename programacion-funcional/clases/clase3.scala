@main def saludo_lapaz(nombre:String) =
    println(s"Hola $nombre desde La Paz")
def saludo_scz(nombre:String) =
    println(s"Hola $nombre desde Santa Cruz")

val nums = List(1,2,3,4,5)
    nums(0)

val nums2 = nums.updated(0,7)

import scala.collection.mutable.ArrayBuffer

val nums = ArrayBuffer(1,2,3,4,5)

nums(0) = 7
nums(1) = 8

println(nums.head)
println(nums.tail)

val lista = List(3,4,2,1,9)
val sublista = lista.slice(2,5)

println(sublista)

println((2 to 4).toList)

def doble(x: Int):Int = x*2

val resultado = nums.map(doble)

def sumaLista(): Unit =
    val nums = List(1,2,3,4,5)
    val suma = nums.sum
    println(s"Suma1 $suma")

def sumaLista(nums: List[Int]): Unit =
    val suma = nums.sum
    println(s"Suma1 $suma")


val resultado = lista.map((x: Int) => x*2)

nums.map(_*2)
nums.filter(_ % 2 == 0)

def filMul(nums: List[Int]): Unit=
    val filtrado: List[Int] = nums.filter(_%2!=0)
    val multiplicacion: List[Int] = filtrado.map(_*10)
    println(multiplicacion)

def saludo(f:String => String, a:String="Hola"):String=f(a)
saludo(a => a + " Diego")

def operate(f: (Int,Int) => Int,a: Int, b: Int):Int = f(a,b)
operate((x,y) => x + y, 2, 3)

val nums = List(1,2,3)
val applyFunc = (f: Int => Int) => nums.map(f)
println(applyFunc(x => x*3))


//se empieza con val, luego pones el nombre y defines la función
//luego aplicas el filtro con la función 
val ejercicio = (f: Int => Boolean) => nums.filter(f)

print(ejercicio(_%2==0))
