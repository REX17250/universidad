class Persona(nombre:String, edad: Int){
    def presentarse(): String =
        s"hola soy $nombre y tengo $edad años"
}

val p = new Persona("Juan", 10)

println(p.presentarse())

class Contador {
    var valor: Int = 0
    def incrementar(): Unit = {
        valor= valor+1
    }
}

val c = new Contador
println(c.valor)
c.incrementar()
println(c.valor)

class CajaInt (valor: Int){
    def get: Int = valor
}
class cajaString(valor: String){
    def get: String = valor
}
val c1 = new CajaInt(42)
println(c1.get)

class Caja[T](valor: T){
    def get: T = valor
}
val cajaEntero = new Caja(100)
println(cajaEntero.get)

def invertir [A,B](par:(A,B)) : (B,A) = (par._2, par._1)
    val r1 = invertir(1,"uno")

def copia [A] (entero: A) : List[A] = List(entero,entero) 
    val r2 = copia(2)

def bool [A, B] (primero: A, segundo: B, bool: Boolean): Any = if (bool) primero else segundo

val r3 = bool(1,2, true)

def b [A] (primero: B, segundo: C, bool: Boolean): A = if (bool) primero else segundo

val r3 = b(1,2, true)