def saludar(msg: String)(using idioma: String): String = 
    s"[$idioma] $msg"

given String = "ES"

saludar("hola")

given idioma: String = "ES"
def demo() = 
    given idioma: String = "EN"
    pritnln(summon[String])
    demo()

extension (x: Int)
    def cuadrado: Int = x*x

println(4.cuadrado)

extension [A](lista: List[A])
    def mitad: List[A] = lista.take(lista.length/2)

println(List(1,2,3,4).mitad)

