@main def llamado(): Unit =
    val v = new Vendedor(nombre = "Juan", salarioBase = 100.0)
    val g = new Gerente(area = "Recursos Humanos", salarioBase = 200.0)  
    val pa = ap(0.2) _

    println(v.descripcion)
    println(g.descripcion)
    println(pa(v))
    println(pa(g))

trait Empleado:
    val salarioBase: Double
    def descripcion: String

class Vendedor(val nombre: String, override val salarioBase: Double) extends Empleado:
    override def descripcion: String = s"Vendedor: $nombre"

class Gerente(val area: String, override val salarioBase: Double) extends Empleado:
    override def descripcion: String = s"Gerente de $area"

def ap(comision: Double)(e: Empleado): Double =
    e.salarioBase + (e.salarioBase * comision)
