def divideInseguro(a: Int, b: Int): Int= a/b
divideInseguro(2,0)

def divide(a: Int, b: Int): Option[Int]=
    if (b== 0) None else Some (a/b)

divide(2,0)

def validateEmailInseguro( email: String): String =
    if (!email.contains("@"))
    throw new Exception ("Email inválido") else email

validateEmailInseguro("holagmail.com")

def validateEmailInseguro( email: String): Either[String, String] =
    if (email.contains("@")) Right(email)
    else Left ("Email inválido")

def validateEmail( email: String): Either[String, String] =
    if (email.contains("@")) Right(email)
    else Left ("Email inválido")

validateEmail("holagmail.com")

//ejercicio
def password(contra: String): Either[String, String] =
    if (contra.exists(_.isDigit) && contra.length>=8) Right(contra)
    else Left("...")

//try
import scala.util.{Try, Success, Failure}

def parseInt(s: String): Try[Int] =
    Try(s.toInt)


//ejercicio
val duplicar = (x: Int) => x * 2

def transformar(s: String, g: Int=>Int): Try[Int] = 
    Try(s.toInt).map(g)

val resultado1 = transformar("10", duplicar)
println(resultado1) 

val resultado2 = transformar("hola", duplicar)
println(resultado2) 

//foreach vs map
def doble(x: Int): Int = x*2

List(1,2,3).map(doble)

List(1,2,3).foreach(doble)

//ejercicio
val datos = List(List(1,2,3),List(4,5),List(6))
def fun(nums: List[List[Int]])(mult: Int): List[Int] =
    nums.flatMap(x=>x.map(_*mult))

val mul10 = fun(datos)(10)

println(mul10)

//fold(usa tu valor inicial) y reduce(usa el primer elemento)
List(1,2,3).fold(0)(_+_)
List(1,2,3).reduce(_+_)

List(1,2,3).foldLeft(0)(_-_)//-6
List(1,2,3).reduceLeft(_-_)//-4

//ejercicio

List("Hola ","Mundo ","Progra Funcional").reduceLeft(_+_)//-4

val palabras = List("Hola ","Mundo ","Progra Funcional")
palabras.reduceLeft(_+_)