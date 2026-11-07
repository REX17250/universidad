class PrimerEjercicio:
    var contador: Int = 1
    def fun(a: Int)(b: Int): Int =
        contador = contador * a * b
        println(contador)
        contador

class SegundoEjercicio:
    lazy val mensaje: String = 
        println("Texto antes de saludo")
        "Hola"
    
    def saludar(nombre: String): Unit = 
        println(s"$mensaje, $nombre")

trait Formato:
    def aplicar(texto: String): String

class Mayusculas extends Formato:
    override def aplicar(texto: String): String = texto.toUpperCase()

class Reverso extends Formato:
    override def aplicar(texto: String): String = texto.reverse

def procesar(f: Formato, s: String): String =
    f.aplicar(s)

class Mensaje:
    var texto: String = ""
    def descripcion: String = "Mensaje Genérico"

class MensajeTexto extends Mensaje:
    override def descripcion: String = "Mensaje de texto"

class MensajeAlerta extends Mensaje:
    override def descripcion: String = "Mensaje de alerta"

class ProcesadorTexto:
    def primero(s: String): String = s.reverse
    def segundo(s: String, f: String => String): String = f(s)

class Animal:
    var nombre: String = ""

class Perro extends Animal

def currier[A <: Animal](lista: List[A])(n: Int) =
    for
        a <- lista
        if a.nombre.length > n
    yield a

@main def llamado() =
    val ej1 = new PrimerEjercicio()
    val ap = ej1.fun(5)
    println(ap(10))

    val ej2 = new SegundoEjercicio()
    ej2.saludar("Diego")

    val m = new Mayusculas()
    val r = new Reverso()
    println(procesar(m, "Holaa"))
    println(procesar(r, "Holaa"))

    val mt = new MensajeTexto()
    val ma = new MensajeAlerta()
    println(mt.descripcion)
    println(ma.descripcion)
    
    val mayus = (s: String) => s.toUpperCase
    val pt = new ProcesadorTexto()
    
    mt.texto = "Camina"
    ma.texto = "Corre"
    
    println(pt.primero(mt.texto))
    println(pt.primero(ma.texto))
    println(pt.segundo(mt.texto, mayus))
    println(pt.segundo(ma.texto, mayus))

    val p1 = new Perro()
    val p2 = new Perro()
    val p3 = new Perro()
    p1.nombre = "Lia"
    p2.nombre = "Chispita"
    p3.nombre = "Lula"

    val lp: List[Animal] = List(p1, p2, p3)
    println(currier(lp)(3))