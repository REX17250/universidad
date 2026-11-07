@main def ejecutar() =
  println(porcentaje(120.0, 15.0))
  println(clasificarEdad(70))
  println(limpiarNombres(List(" aNA ", " ", "Carlos")))
  println(operador(esPar)(4)(3))
  println(operador(esPar)(5)(3))
  println(proceso(List(2,4,6,7,9), 100))
  val sumar = (n: Int) => n + 2
  val multiplicar = (n: Int) => n * 3
  val lista = List(sumar, multiplicar)
  println(pipelineModifier(lista, 5))

//1)
def porcentaje(monto: Double, porc: Double): String =
  val aplicar = (m: Double, p: Double) => m*(p/100)
  val redondear = (n: Double) => f"$n%.2f"
  "$<"+redondear(aplicar(monto, porc))+">"

//2)
def clasificarEdad(edad: Int): String =
  if edad < 13 then "niño"
  else if edad < 22 then "adolescente"
  else if edad < 60 then "adulto"
  else "señor"

//3)
def limpiarNombres(lista: List[String]): List[String] =
  val sinEspacios = (s: String) => s.trim
  val minus = (s: String) => s.toLowerCase
  val capitalizar = (s: String) =>
    if s.isEmpty then "" else s.head.toUpper + s.tail
  lista.map(sinEspacios.andThen(minus).andThen(capitalizar)).filter(_!="")

//4)
def operador(condicion: Int => Boolean)(x: Int)(y: Int): Int =
  if condicion(x) then x+y else x-y

def esPar(n: Int): Boolean = n%2==0

//5)
val proceso=(lista: List[Int], mayor: Int) => lista.filter(_%2==0).map(_*3).sum/2>mayor

//6)
def pipelineModifier(funcs: List[Int => Int], x: Int): Int={
  if(funcs.isEmpty){
    x
  }else{
    pipelineModifier(funcs.tail, funcs.head(x))
  }
}


