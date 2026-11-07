@main def llamado()=
    println(sumar(3, 5))
    println(sumar("Hola, ", "Scala"))

trait Sumar[A]:
    def sumar(x: A, y: A): A


given Sumar[Int] with
    def sumar(x: Int, y: Int) = x+y

given Sumar[String] with
    def sumar(x: String, y: String) = x+y

def sumar[A](x: A, y: A)(using s: Sumar[A]): A =
    s.sumar(x, y)

