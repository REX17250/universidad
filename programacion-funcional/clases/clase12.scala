//herencia
class Animal (val nombre:String):
    def hablar(): Unit=
        println(s"$nombre hace un sonido")

class Perro (nombre: String) extends Animal(nombre):
    override def hablar(): Unit =
        println(s"$nombre dice: Guau!")

class Gato(nombre: String) extends Animal(nombre):
    override def hablar(): Unit =
        println(s"$nombre dice: Miau!")

val a: Animal =new Animal("Bicho")
val p: Animal =new Perro("Firulais")
val g: Animal =new Gato("Michi")

a.hablar()
p.hablar()
g.hablar()

abstract class Figura:
    def area: Double
    def descripcion: String ="Soy una figura geométrica"

class Circulo (val radio: Double) extends Figura:
    override def area: Double = Math.PI * radio * radio
    override def descripcion: String = s"Soy un círculo de radio $radio"

class Rectangulo(val ancho : Double, val alto: Double) extends Figura:
    override def area: Double = ancho * alto

def figuras Demo(): Unit =
    val figuras: List[Figura] = List(new Criculo(2.0), new Rectangulo(3.0, 4.0))

figuras.foreach { f => println(s"${f.descripcion}, área ={f.area}")}

//ejercicio
class Vehículo:
    def marca: String
    def descripcion: String = s"Vehículo marca $marca"

class auto (val puertas: Int) extends Vehículo:
    override descripcion: String = s"Auto marca $marca con $puertas puertas"

class moto (val cilindrada: Int) extends Vehículo:
    override descripcion: String = s"Moto marca $marca con $cilindrada de cilindrada"

//traits
trait Volador:
    def colar(): Unit

class Pato(nombre: String)extends Animal(nombre),volador:
    override def hablar() = println("Cuac!")
    def volar() = println("El pato cuela")